/* eslint-disable @typescript-eslint/no-require-imports */ // This is required for fs, path, and lodash

import fs = require('fs');
import path = require('path');
import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import set = require('lodash.set');
import { minify } from 'uglify-js';
import { NestedStringObject, NextjsRoutesManifest } from './nextjsTypes';
import { NextjsExportS3DynamicRoutingDistributionProps } from './omitCdkTypes';

/**
 * Deploy a static export Next.js site to Cloudfront and S3 while maintaining the ability to use dynamic routes.
 *
 * Deploys Cloudfront, a Cloudfront Function, an S3 Bucket, and an S3 Deployment.
 *
 * With defaults set, if this construct is removed, all resources will be cleaned up.
 */
export interface NextjsExportS3DynamicRoutingSiteProps {
  /**
   * @default ./.next
   */
  readonly nextBuildDir?: string;
  /**
   * The relative path to the Next.js project.
   *
   * @default ./out
   */
  readonly nextExportPath?: string;

  /**
   * Passthrough props to customize the S3 bucket.
   *
   * @default {
   *   publicReadAccess: false,
   *   blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
   *   autoDeleteObjects: true,
   *   removalPolicy: cdk.RemovalPolicy.DESTROY,
   * }
   */
  readonly bucketProps?: s3.BucketProps;

  /**
   * Passthrough props to customize the Cloudfront distribution.
   *
   * @default Sets up the S3 Origin and Cache Policy.
   */
  readonly distributionProps?: NextjsExportS3DynamicRoutingDistributionProps;

  /**
   * Passthrough props to customize the S3 Origin.
   *
   * @default S3 Origin defaults.
   */
  readonly s3OriginProps?: origins.S3OriginProps;
}

const VALID_NEXTJS_ROUTES_MANIFEST_VERSION = 3;
const PAGE_FIELD_NAME_FOR_DYNAMIC_ROUTE_OBJECT = '___page';
const STANDARDIZED_DYNAMIC_ROUTE_MAPPING_PLACEHOLDER = '*';

const DEFAULT_NEXT_BUILD_DIR = './.next';
const DEFAULT_NEXT_EXPORT_DIR = './out';
const MAX_CLOUDFRONT_FUNCTION_SIZE = 10240;

const CACHE_CONTROL_FOREVER = 'public,max-age=31536000,immutable';
const CACHE_CONTROL_SERVER_LONG_NO_BROWSER = 'public,max-age=0,s-maxage=2678400,must-revalidate';

/**
 * Deploy an exported, static site using Next.js.
 * Compatible with a Next 13 project using /pages routing.
 *
 * @see For Static Site Limitations: https://nextjs.org/docs/advanced-features/static-html-export
 *
 * Additional Limitations:
 * - Cloudfront function size is capped at 10KB. This may be exceeded if the amount of pages (page types, not static pages with many static paths) is extremely large, as each represents a JSON object in the code.
 *    - For estimation, if we assume around 1000 characters of natural overhead and average 100 characters per page type, this calculates to about 90 page types (files in the pages folder).
 */
export class NextjsExportS3DynamicRoutingSite extends Construct {
  /**
   * Included for convenience, this cache policy is very similar to Amplify's cache policy,
   * but with a higher maxTtl.
   */
  public static readonly RECOMMENDED_CACHE_POLICY: cloudfront.CachePolicyProps = {
    queryStringBehavior: cloudfront.CacheQueryStringBehavior.all(),
    headerBehavior: cloudfront.CacheHeaderBehavior.none(),
    cookieBehavior: cloudfront.CacheCookieBehavior.all(),
    defaultTtl: cdk.Duration.seconds(0),
    maxTtl: cdk.Duration.days(365),
    minTtl: cdk.Duration.seconds(0),
    enableAcceptEncodingBrotli: true,
    enableAcceptEncodingGzip: true,
    comment: 'Next.js Export Dynamic Routing Site Cache Policy',
  };

  public readonly viewerRequestCloudfrontFunction: cloudfront.Function;
  public readonly s3Bucket: s3.Bucket;
  public readonly cloudfrontDistribution: cloudfront.Distribution;

  constructor(scope: Construct, private readonly id: string, private readonly props: NextjsExportS3DynamicRoutingSiteProps) {
    super(scope, id);

    this.viewerRequestCloudfrontFunction = this.createCloudfrontUrlRewriterFunction();
    this.s3Bucket = this.createS3Bucket();
    this.cloudfrontDistribution = this.createCloudfrontDistribution();
    this.deploySiteToS3();
  }

  /**
   * Rewrites incoming dynamic URLs to the correct path in the S3 bucket.
   * Otherwise, leaves the request alone.
   *
   * This adds almost zero latency, or is so negligible it cannot be measured.
   *
   * @returns cloudfront.Function
   */
  private createCloudfrontUrlRewriterFunction(): cloudfront.Function {
    const nextBuildDir = this.props.nextBuildDir ?? DEFAULT_NEXT_BUILD_DIR;
    const routesManifestPath = path.join(
      process.cwd(),
      nextBuildDir,
      'routes-manifest.json',
    );

    if (!fs.existsSync(routesManifestPath)) {
      throw new Error(
        `Could not find routes-manifest.json in ${nextBuildDir}. Please ensure you have run \`next build && next export\` before deploying.`,
      );
    }

    console.log(
      `Producing Cloudfront Function code for ${nextBuildDir} routes-manifest.json`,
    );
    const routesManifest = fs.readFileSync(
      routesManifestPath,
      'utf8',
    );

    const parsedRoutesManifest = JSON.parse(
      routesManifest,
    ) as NextjsRoutesManifest;

    if (
      parsedRoutesManifest.version !== VALID_NEXTJS_ROUTES_MANIFEST_VERSION
    ) {
      throw new Error(
        `NextjsStaticSite only supports Next.js version 10.0.0 or greater, you are currently using a routesManifest with version ${parsedRoutesManifest.version} and it must be ${VALID_NEXTJS_ROUTES_MANIFEST_VERSION}.`,
      );
    }

    if (
      parsedRoutesManifest.dataRoutes && parsedRoutesManifest.dataRoutes.length > 0
    ) {
      throw new Error(
        'Data Routes detected. Incremental static regeneration is not supported using this construct. Please convert to static pages instead.',
      );
    }

    const staticRoutePages = parsedRoutesManifest.staticRoutes
      .map((route) => route.page)
      .filter(Boolean);


    const dynamicRoutePages = this.buildDynamicRoutePages(parsedRoutesManifest);

    return new cloudfront.Function(this, `${this.id}-CloudfrontUrlRewriterFunction`, {
      code: cloudfront.FunctionCode.fromInline(
        this.buildCloudfrontFunctionCode(
          JSON.stringify(staticRoutePages),
          JSON.stringify(dynamicRoutePages),
        )),
    });
  }

  /**
   * This is in part to reduce the storage of these routes, but it also is massively more CPU efficient
   * than using Regex.
   *
   * Cloudfront functions have an arbitrary time * CPU metric that is hard to grasp, but it starts timing out at about
   * 10 routes with using Regex (as prescribed by Vercel's design).
   * I have yet to see a timeout with this method, even with many routes. We are likely to hit size limits
   * before CPU limits.
   *
   * This could probably support catch-all routes, but I have not found a reason to do so, yet.
   *
   * @see NestedStringObject
   * @see The Cloudfront Function Code dynamic routes logic
   */
  private buildDynamicRoutePages(parsedRoutesManifest: NextjsRoutesManifest): NestedStringObject {
    return parsedRoutesManifest.dynamicRoutes.reduce(
      (result, route) => {
        const page = route.page;
        if (page.includes('[...')) {
          throw new Error(
            'Catch-all routes are not supported using this construct. Please convert to standard dynamic pages instead.',
          );
        }
        const pageParts = page
          .split('/')
          .filter(Boolean)
          .map((part) =>
            part.startsWith('[')
              ? STANDARDIZED_DYNAMIC_ROUTE_MAPPING_PLACEHOLDER
              : part,
          );

        set(result, pageParts.join('.'), {
          [PAGE_FIELD_NAME_FOR_DYNAMIC_ROUTE_OBJECT]: page,
        });

        return result;
      },
      {} as NestedStringObject,
    );
  }

  /**
   * Builds and minifies the Cloudfront Function code to rewrite URLs as needed.
   *
   * @param staticRoutePagesStringified Used to map static routes to their S3 path.
   * @param dynamicRoutePagesStringified Used to map dynamic routes to their S3 path.
   * @returns string (minified Cloudfront Function code)
   */
  private buildCloudfrontFunctionCode(
    staticRoutePagesStringified: string,
    dynamicRoutePagesStringified: string,
  ): string {
    const functionCode = minify(
      `function handler(event) {
        var req = event.request;

        function hasExtension(url) {
            var parts = url.split('/'),
                last  = parts.pop();
            return !!last && typeof last === "string" && last.indexOf('.') !== -1;
        }

        if (req.uri.startsWith('/_next') || hasExtension(req.uri)) {
            return req;
        }

        var staticRoutePages = ${staticRoutePagesStringified};
        var dynamicRoutePages = ${dynamicRoutePagesStringified};                

        var suffix = '.html';
        
        function removeTrailingSlash(page) {
            if (page.endsWith('/')) {
                return page.slice(0, -1);
            }
            return page;
        }

        var requestUri = removeTrailingSlash(req.uri);

        if (req.uri.endsWith(suffix)) {
            return req;
        }

        if (req.uri === '') {
            req.uri = '/index.html';
            return req;
        }

        function addSuffix(page) {
            return page + suffix;
        }

        for (var i = 0; i < staticRoutePages.length; i++) {
            if (staticRoutePages.includes(requestUri)) {
                req.uri = addSuffix(requestUri);
                return req;
            }
        }

        var uriSections = requestUri.split('/').filter(Boolean);
        
        // dynamicRoutePages is a nested object, this iterator either finds the exact match or a dynamic match and returns the original page, which is stored on a special key in the nested object.
        var currentRouteObject = dynamicRoutePages;
        for (var i = 0; i < uriSections.length; i++) {
            var uriSection = uriSections[i];
            var isLastUriSection = i === uriSections.length - 1;

            if (currentRouteObject[uriSection]) { // exact match
                if (isLastUriSection) {
                    if (currentRouteObject[uriSection]['${PAGE_FIELD_NAME_FOR_DYNAMIC_ROUTE_OBJECT}']) {
                        req.uri = addSuffix(currentRouteObject[uriSection]['${PAGE_FIELD_NAME_FOR_DYNAMIC_ROUTE_OBJECT}']);
                        return req;
                    }
                }
                currentRouteObject = currentRouteObject[uriSection];
                continue; // Found valid exact match
            } else if (currentRouteObject['${STANDARDIZED_DYNAMIC_ROUTE_MAPPING_PLACEHOLDER}']) { // dynamic match
                if (isLastUriSection) {
                    if (currentRouteObject['${STANDARDIZED_DYNAMIC_ROUTE_MAPPING_PLACEHOLDER}']['${PAGE_FIELD_NAME_FOR_DYNAMIC_ROUTE_OBJECT}']) {
                        req.uri = addSuffix(currentRouteObject['${STANDARDIZED_DYNAMIC_ROUTE_MAPPING_PLACEHOLDER}']['${PAGE_FIELD_NAME_FOR_DYNAMIC_ROUTE_OBJECT}']);
                        return req;
                    }
                }
                currentRouteObject = currentRouteObject['${STANDARDIZED_DYNAMIC_ROUTE_MAPPING_PLACEHOLDER}'];
                continue; // Found valid dynamic match
            }
            break; // Not a match, we are done looking
        }

        return req;                
    }`,
    );

    if (
      Buffer.byteLength(functionCode.code, 'utf8') >
      MAX_CLOUDFRONT_FUNCTION_SIZE
    ) {
      // TODO: Build site with Lambda@Edge instead, which caps at 1MB.
      throw new Error(
        'Cloudfront function size is capped at 10KB, you have too many page types.',
      );
    }

    return functionCode.code;
  };

  /**
   * Creates a locked down S3 bucket for the static site that only allows access from the Cloudfront distribution.
   *
   * @returns s3.Bucket
   */
  private createS3Bucket(): s3.Bucket {
    return new s3.Bucket(this, `${this.id}-S3Bucket`, {
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      autoDeleteObjects: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      ...this.props.bucketProps,
    });
  };

  /**
   * Creates a cloudfront distribution with logic to handle typical Next.js functionality, like 404 pages.
   *
   * @returns cloudfront.Distribution
   */
  private createCloudfrontDistribution(): cloudfront.Distribution {
    return new cloudfront.Distribution(this, `${this.id}-CloudfrontDistribution`, {
      defaultRootObject: 'index.html',
      ...this.props.distributionProps,
      errorResponses: this.props.distributionProps?.errorResponses ?? [
        {
          httpStatus: 403,
          responsePagePath: '/404.html',
        },
        {
          httpStatus: 404,
          responsePagePath: '/404.html',
        },
      ],
      defaultBehavior: {
        origin: new origins.S3Origin(this.s3Bucket, this.props.s3OriginProps),
        functionAssociations: [{
          eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
          function: this.viewerRequestCloudfrontFunction,
        }],
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
        compress: true,
        cachePolicy: this.props.distributionProps?.defaultBehavior?.cachePolicy ??
          new cloudfront.CachePolicy(
            this,
            `${this.id}-CloudfrontCachePolicy`,
            NextjsExportS3DynamicRoutingSite.RECOMMENDED_CACHE_POLICY,
          ),
        ...this.props.distributionProps?.defaultBehavior,
      },
    });
  }

  /**
   * Deploys two separate deployments to S3, with different cache control settings.
   * @returns Two s3deploy.BucketDeployment objects.
   */
  private deploySiteToS3(): s3deploy.BucketDeployment[] {
    const result = new Array<s3deploy.BucketDeployment>();
    const nextExportPath = this.props.nextExportPath ?? DEFAULT_NEXT_EXPORT_DIR;

    /** These are things Next.js hashes, and are handled through invalidation. */
    const extensionsToCacheForever = ['*.js', '*.css'];

    result.push(new s3deploy.BucketDeployment(this, `${this.id}-S3BucketDeployment-Forever`, {
      sources: [s3deploy.Source.asset(path.join(process.cwd(), nextExportPath))],
      destinationBucket: this.s3Bucket,
      include: extensionsToCacheForever,
      cacheControl: [s3deploy.CacheControl.fromString(CACHE_CONTROL_FOREVER)],
      prune: false,
    }));

    result.push(new s3deploy.BucketDeployment(this, `${this.id}-S3BucketDeployment-Default`, {
      sources: [s3deploy.Source.asset(path.join(process.cwd(), nextExportPath))],
      destinationBucket: this.s3Bucket,
      exclude: extensionsToCacheForever,
      cacheControl: [s3deploy.CacheControl.fromString(CACHE_CONTROL_SERVER_LONG_NO_BROWSER)],
      prune: false,
      distribution: this.cloudfrontDistribution, // Invalidate the Cloudfront distribution, the whole thing.
    }));

    return result;
  }
}