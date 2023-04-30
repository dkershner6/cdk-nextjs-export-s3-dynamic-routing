# Next.js Static Export S3 Site with Dynamic Routing

[NPM](https://www.npmjs.com/package/cdk-nextjs-export-s3-dynamic-routing)

[![View on Construct Hub](https://constructs.dev/badge?package=cdk-nextjs-export-s3-dynamic-routing)](https://constructs.dev/packages/cdk-nextjs-export-s3-dynamic-routing)

_Have a more complex use case for Next.js 13? Perhaps check out [cdk-nextjs-standalone-ecs](https://constructs.dev/packages/cdk-nextjs-standalone-ecs)._

Deploy a static export Next.js site to Cloudfront and S3 while maintaining the ability to use dynamic routes.

This effectively takes all of the benefits of Next.js, including routing, code-splitting, static HTML exporting, and also gives you the benefits of a SPA (single page application). This will be mostly useful for client-generated pages, but you can also partially server side generate some data should you choose.

This may also be useful if you use Next.js SSR in other frontends, and just want to keep a consistent experience for your developers.

## Getting Started

You can use this construct effectively with no props, but here is a minimal example with a custom domain:

```ts
export class MyStaticSiteStack extends cdk.Stack {
    private readonly hostedZone: route53.IHostedZone;
    private readonly customDomainName: string;
    private readonly site: NextjsExportS3DynamicRoutingSite;

    constructor(scope: sst.App, id: string, props?: sst.StackProps) {
        super(scope, id, props);

        this.hostedZone = this.findHostedZone();
        this.customDomainName = "yourdomain.com";

        this.site = this.createNextJsSite();
        this.createDnsRecord();
    }

    private findHostedZone(): route53.IHostedZone {
        return route53.HostedZone.fromLookup(this, "HostedZone", {
            domainName: this.customDomainName,
        });
    }

    private createNextJsSite(): NextjsExportS3DynamicRoutingSite {
        const certificate = new acm.Certificate(
            this,
            "Certificate",
            {
                domainName: this.customDomainName,
                validation: acm.CertificateValidation.fromDns(this.hostedZone),
            }
        );

        return new NextjsExportS3DynamicRoutingSite(this, "NextJsSite", {
            distributionProps: {
                certificate,
                domainNames: [this.customDomainName],
            }
        });
    }

    private createDnsRecord = (): route53.ARecord => {
        return new route53.ARecord(this, `AliasRecord`, {
            recordName: this.customDomainName,
            target: route53.RecordTarget.fromAlias(
                new r53Targets.CloudFrontTarget(
                    this.site.cloudfrontDistribution
                )
            ),
            zone: this.hostedZone,
        });
    };
}
```

There are no outside requirements for this construct, and it will delete all of its resources when the stack is deleted.
# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### NextjsExportS3DynamicRoutingSite <a name="NextjsExportS3DynamicRoutingSite" id="cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingSite"></a>

Deploy an exported, static site using Next.js. Compatible with a Next 13 project using /pages routing.

> [For Static Site Limitations: https://nextjs.org/docs/advanced-features/static-html-export

Additional Limitations:
- Cloudfront function size is capped at 10KB. This may be exceeded if the amount of pages (page types, not static pages with many static paths) is extremely large, as each represents a JSON object in the code.
- For estimation, if we assume around 1000 characters of natural overhead and average 100 characters per page type, this calculates to about 90 page types (files in the pages folder).](For Static Site Limitations: https://nextjs.org/docs/advanced-features/static-html-export

Additional Limitations:
- Cloudfront function size is capped at 10KB. This may be exceeded if the amount of pages (page types, not static pages with many static paths) is extremely large, as each represents a JSON object in the code.
- For estimation, if we assume around 1000 characters of natural overhead and average 100 characters per page type, this calculates to about 90 page types (files in the pages folder).)

#### Initializers <a name="Initializers" id="cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingSite.Initializer"></a>

```typescript
import { NextjsExportS3DynamicRoutingSite } from 'cdk-nextjs-export-s3-dynamic-routing'

new NextjsExportS3DynamicRoutingSite(scope: Construct, id: string, props: NextjsExportS3DynamicRoutingSiteProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingSite.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingSite.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingSite.Initializer.parameter.props">props</a></code> | <code><a href="#cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingSiteProps">NextjsExportS3DynamicRoutingSiteProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingSite.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingSite.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingSite.Initializer.parameter.props"></a>

- *Type:* <a href="#cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingSiteProps">NextjsExportS3DynamicRoutingSiteProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingSite.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingSite.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingSite.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingSite.isConstruct"></a>

```typescript
import { NextjsExportS3DynamicRoutingSite } from 'cdk-nextjs-export-s3-dynamic-routing'

NextjsExportS3DynamicRoutingSite.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingSite.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingSite.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingSite.property.cloudfrontDistribution">cloudfrontDistribution</a></code> | <code>aws-cdk-lib.aws_cloudfront.Distribution</code> | *No description.* |
| <code><a href="#cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingSite.property.s3Bucket">s3Bucket</a></code> | <code>aws-cdk-lib.aws_s3.Bucket</code> | *No description.* |
| <code><a href="#cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingSite.property.viewerRequestCloudfrontFunction">viewerRequestCloudfrontFunction</a></code> | <code>aws-cdk-lib.aws_cloudfront.Function</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingSite.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `cloudfrontDistribution`<sup>Required</sup> <a name="cloudfrontDistribution" id="cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingSite.property.cloudfrontDistribution"></a>

```typescript
public readonly cloudfrontDistribution: Distribution;
```

- *Type:* aws-cdk-lib.aws_cloudfront.Distribution

---

##### `s3Bucket`<sup>Required</sup> <a name="s3Bucket" id="cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingSite.property.s3Bucket"></a>

```typescript
public readonly s3Bucket: Bucket;
```

- *Type:* aws-cdk-lib.aws_s3.Bucket

---

##### `viewerRequestCloudfrontFunction`<sup>Required</sup> <a name="viewerRequestCloudfrontFunction" id="cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingSite.property.viewerRequestCloudfrontFunction"></a>

```typescript
public readonly viewerRequestCloudfrontFunction: Function;
```

- *Type:* aws-cdk-lib.aws_cloudfront.Function

---

#### Constants <a name="Constants" id="Constants"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingSite.property.RECOMMENDED_CACHE_POLICY">RECOMMENDED_CACHE_POLICY</a></code> | <code>aws-cdk-lib.aws_cloudfront.CachePolicyProps</code> | Included for convenience, this cache policy is very similar to Amplify's cache policy, but with a higher maxTtl. |

---

##### `RECOMMENDED_CACHE_POLICY`<sup>Required</sup> <a name="RECOMMENDED_CACHE_POLICY" id="cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingSite.property.RECOMMENDED_CACHE_POLICY"></a>

```typescript
public readonly RECOMMENDED_CACHE_POLICY: CachePolicyProps;
```

- *Type:* aws-cdk-lib.aws_cloudfront.CachePolicyProps

Included for convenience, this cache policy is very similar to Amplify's cache policy, but with a higher maxTtl.

---

## Structs <a name="Structs" id="Structs"></a>

### NextjsExportS3DynamicRoutingDistributionProps <a name="NextjsExportS3DynamicRoutingDistributionProps" id="cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingDistributionProps"></a>

Differences from cloudfront.DistributionProps: - defaultBehavior is optional.

#### Initializer <a name="Initializer" id="cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingDistributionProps.Initializer"></a>

```typescript
import { NextjsExportS3DynamicRoutingDistributionProps } from 'cdk-nextjs-export-s3-dynamic-routing'

const nextjsExportS3DynamicRoutingDistributionProps: NextjsExportS3DynamicRoutingDistributionProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingDistributionProps.property.additionalBehaviors">additionalBehaviors</a></code> | <code>{[ key: string ]: aws-cdk-lib.aws_cloudfront.BehaviorOptions}</code> | Additional behaviors for the distribution, mapped by the pathPattern that specifies which requests to apply the behavior to. |
| <code><a href="#cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingDistributionProps.property.certificate">certificate</a></code> | <code>aws-cdk-lib.aws_certificatemanager.ICertificate</code> | A certificate to associate with the distribution. |
| <code><a href="#cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingDistributionProps.property.comment">comment</a></code> | <code>string</code> | Any comments you want to include about the distribution. |
| <code><a href="#cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingDistributionProps.property.defaultBehavior">defaultBehavior</a></code> | <code>aws-cdk-lib.aws_cloudfront.BehaviorOptions</code> | The default behavior for the distribution. |
| <code><a href="#cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingDistributionProps.property.defaultRootObject">defaultRootObject</a></code> | <code>string</code> | The object that you want CloudFront to request from your origin (for example, index.html) when a viewer requests the root URL for your distribution. If no default object is set, the request goes to the origin's root (e.g., example.com/). |
| <code><a href="#cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingDistributionProps.property.domainNames">domainNames</a></code> | <code>string[]</code> | Alternative domain names for this distribution. |
| <code><a href="#cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingDistributionProps.property.enabled">enabled</a></code> | <code>boolean</code> | Enable or disable the distribution. |
| <code><a href="#cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingDistributionProps.property.enableIpv6">enableIpv6</a></code> | <code>boolean</code> | Whether CloudFront will respond to IPv6 DNS requests with an IPv6 address. |
| <code><a href="#cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingDistributionProps.property.enableLogging">enableLogging</a></code> | <code>boolean</code> | Enable access logging for the distribution. |
| <code><a href="#cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingDistributionProps.property.errorResponses">errorResponses</a></code> | <code>aws-cdk-lib.aws_cloudfront.ErrorResponse[]</code> | How CloudFront should handle requests that are not successful (e.g., PageNotFound). |
| <code><a href="#cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingDistributionProps.property.geoRestriction">geoRestriction</a></code> | <code>aws-cdk-lib.aws_cloudfront.GeoRestriction</code> | Controls the countries in which your content is distributed. |
| <code><a href="#cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingDistributionProps.property.httpVersion">httpVersion</a></code> | <code>aws-cdk-lib.aws_cloudfront.HttpVersion</code> | Specify the maximum HTTP version that you want viewers to use to communicate with CloudFront. |
| <code><a href="#cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingDistributionProps.property.logBucket">logBucket</a></code> | <code>aws-cdk-lib.aws_s3.IBucket</code> | The Amazon S3 bucket to store the access logs in. |
| <code><a href="#cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingDistributionProps.property.logFilePrefix">logFilePrefix</a></code> | <code>string</code> | An optional string that you want CloudFront to prefix to the access log filenames for this distribution. |
| <code><a href="#cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingDistributionProps.property.logIncludesCookies">logIncludesCookies</a></code> | <code>boolean</code> | Specifies whether you want CloudFront to include cookies in access logs. |
| <code><a href="#cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingDistributionProps.property.minimumProtocolVersion">minimumProtocolVersion</a></code> | <code>aws-cdk-lib.aws_cloudfront.SecurityPolicyProtocol</code> | The minimum version of the SSL protocol that you want CloudFront to use for HTTPS connections. |
| <code><a href="#cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingDistributionProps.property.priceClass">priceClass</a></code> | <code>aws-cdk-lib.aws_cloudfront.PriceClass</code> | The price class that corresponds with the maximum price that you want to pay for CloudFront service. |
| <code><a href="#cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingDistributionProps.property.sslSupportMethod">sslSupportMethod</a></code> | <code>aws-cdk-lib.aws_cloudfront.SSLMethod</code> | The SSL method CloudFront will use for your distribution. |
| <code><a href="#cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingDistributionProps.property.webAclId">webAclId</a></code> | <code>string</code> | Unique identifier that specifies the AWS WAF web ACL to associate with this CloudFront distribution. |

---

##### `additionalBehaviors`<sup>Optional</sup> <a name="additionalBehaviors" id="cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingDistributionProps.property.additionalBehaviors"></a>

```typescript
public readonly additionalBehaviors: {[ key: string ]: BehaviorOptions};
```

- *Type:* {[ key: string ]: aws-cdk-lib.aws_cloudfront.BehaviorOptions}
- *Default:* no additional behaviors are added.

Additional behaviors for the distribution, mapped by the pathPattern that specifies which requests to apply the behavior to.

---

##### `certificate`<sup>Optional</sup> <a name="certificate" id="cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingDistributionProps.property.certificate"></a>

```typescript
public readonly certificate: ICertificate;
```

- *Type:* aws-cdk-lib.aws_certificatemanager.ICertificate
- *Default:* the CloudFront wildcard certificate (*.cloudfront.net) will be used.

A certificate to associate with the distribution.

The certificate must be located in N. Virginia (us-east-1).

---

##### `comment`<sup>Optional</sup> <a name="comment" id="cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingDistributionProps.property.comment"></a>

```typescript
public readonly comment: string;
```

- *Type:* string
- *Default:* no comment

Any comments you want to include about the distribution.

---

##### `defaultBehavior`<sup>Optional</sup> <a name="defaultBehavior" id="cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingDistributionProps.property.defaultBehavior"></a>

```typescript
public readonly defaultBehavior: BehaviorOptions;
```

- *Type:* aws-cdk-lib.aws_cloudfront.BehaviorOptions

The default behavior for the distribution.

Optional here, not usually optional in the CDK.

---

##### `defaultRootObject`<sup>Optional</sup> <a name="defaultRootObject" id="cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingDistributionProps.property.defaultRootObject"></a>

```typescript
public readonly defaultRootObject: string;
```

- *Type:* string
- *Default:* no default root object

The object that you want CloudFront to request from your origin (for example, index.html) when a viewer requests the root URL for your distribution. If no default object is set, the request goes to the origin's root (e.g., example.com/).

---

##### `domainNames`<sup>Optional</sup> <a name="domainNames" id="cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingDistributionProps.property.domainNames"></a>

```typescript
public readonly domainNames: string[];
```

- *Type:* string[]
- *Default:* The distribution will only support the default generated name (e.g., d111111abcdef8.cloudfront.net)

Alternative domain names for this distribution.

If you want to use your own domain name, such as www.example.com, instead of the cloudfront.net domain name,
you can add an alternate domain name to your distribution. If you attach a certificate to the distribution,
you must add (at least one of) the domain names of the certificate to this list.

---

##### `enabled`<sup>Optional</sup> <a name="enabled" id="cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingDistributionProps.property.enabled"></a>

```typescript
public readonly enabled: boolean;
```

- *Type:* boolean
- *Default:* true

Enable or disable the distribution.

---

##### `enableIpv6`<sup>Optional</sup> <a name="enableIpv6" id="cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingDistributionProps.property.enableIpv6"></a>

```typescript
public readonly enableIpv6: boolean;
```

- *Type:* boolean
- *Default:* true

Whether CloudFront will respond to IPv6 DNS requests with an IPv6 address.

If you specify false, CloudFront responds to IPv6 DNS requests with the DNS response code NOERROR and with no IP addresses.
This allows viewers to submit a second request, for an IPv4 address for your distribution.

---

##### `enableLogging`<sup>Optional</sup> <a name="enableLogging" id="cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingDistributionProps.property.enableLogging"></a>

```typescript
public readonly enableLogging: boolean;
```

- *Type:* boolean
- *Default:* false, unless `logBucket` is specified.

Enable access logging for the distribution.

---

##### `errorResponses`<sup>Optional</sup> <a name="errorResponses" id="cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingDistributionProps.property.errorResponses"></a>

```typescript
public readonly errorResponses: ErrorResponse[];
```

- *Type:* aws-cdk-lib.aws_cloudfront.ErrorResponse[]
- *Default:* No custom error responses.

How CloudFront should handle requests that are not successful (e.g., PageNotFound).

---

##### `geoRestriction`<sup>Optional</sup> <a name="geoRestriction" id="cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingDistributionProps.property.geoRestriction"></a>

```typescript
public readonly geoRestriction: GeoRestriction;
```

- *Type:* aws-cdk-lib.aws_cloudfront.GeoRestriction
- *Default:* No geographic restrictions

Controls the countries in which your content is distributed.

---

##### `httpVersion`<sup>Optional</sup> <a name="httpVersion" id="cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingDistributionProps.property.httpVersion"></a>

```typescript
public readonly httpVersion: HttpVersion;
```

- *Type:* aws-cdk-lib.aws_cloudfront.HttpVersion
- *Default:* HttpVersion.HTTP2

Specify the maximum HTTP version that you want viewers to use to communicate with CloudFront.

For viewers and CloudFront to use HTTP/2, viewers must support TLS 1.2 or later, and must support server name identification (SNI).

---

##### `logBucket`<sup>Optional</sup> <a name="logBucket" id="cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingDistributionProps.property.logBucket"></a>

```typescript
public readonly logBucket: IBucket;
```

- *Type:* aws-cdk-lib.aws_s3.IBucket
- *Default:* A bucket is created if `enableLogging` is true

The Amazon S3 bucket to store the access logs in.

Make sure to set `objectOwnership` to `s3.ObjectOwnership.OBJECT_WRITER` in your custom bucket.

---

##### `logFilePrefix`<sup>Optional</sup> <a name="logFilePrefix" id="cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingDistributionProps.property.logFilePrefix"></a>

```typescript
public readonly logFilePrefix: string;
```

- *Type:* string
- *Default:* no prefix

An optional string that you want CloudFront to prefix to the access log filenames for this distribution.

---

##### `logIncludesCookies`<sup>Optional</sup> <a name="logIncludesCookies" id="cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingDistributionProps.property.logIncludesCookies"></a>

```typescript
public readonly logIncludesCookies: boolean;
```

- *Type:* boolean
- *Default:* false

Specifies whether you want CloudFront to include cookies in access logs.

---

##### `minimumProtocolVersion`<sup>Optional</sup> <a name="minimumProtocolVersion" id="cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingDistributionProps.property.minimumProtocolVersion"></a>

```typescript
public readonly minimumProtocolVersion: SecurityPolicyProtocol;
```

- *Type:* aws-cdk-lib.aws_cloudfront.SecurityPolicyProtocol
- *Default:* SecurityPolicyProtocol.TLS_V1_2_2021 if the '@aws-cdk/aws-cloudfront:defaultSecurityPolicyTLSv1.2_2021' feature flag is set; otherwise, SecurityPolicyProtocol.TLS_V1_2_2019.

The minimum version of the SSL protocol that you want CloudFront to use for HTTPS connections.

CloudFront serves your objects only to browsers or devices that support at
least the SSL version that you specify.

---

##### `priceClass`<sup>Optional</sup> <a name="priceClass" id="cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingDistributionProps.property.priceClass"></a>

```typescript
public readonly priceClass: PriceClass;
```

- *Type:* aws-cdk-lib.aws_cloudfront.PriceClass
- *Default:* PriceClass.PRICE_CLASS_ALL

The price class that corresponds with the maximum price that you want to pay for CloudFront service.

If you specify PriceClass_All, CloudFront responds to requests for your objects from all CloudFront edge locations.
If you specify a price class other than PriceClass_All, CloudFront serves your objects from the CloudFront edge location
that has the lowest latency among the edge locations in your price class.

---

##### `sslSupportMethod`<sup>Optional</sup> <a name="sslSupportMethod" id="cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingDistributionProps.property.sslSupportMethod"></a>

```typescript
public readonly sslSupportMethod: SSLMethod;
```

- *Type:* aws-cdk-lib.aws_cloudfront.SSLMethod
- *Default:* SSLMethod.SNI

The SSL method CloudFront will use for your distribution.

Server Name Indication (SNI) - is an extension to the TLS computer networking protocol by which a client indicates
which hostname it is attempting to connect to at the start of the handshaking process. This allows a server to present
multiple certificates on the same IP address and TCP port number and hence allows multiple secure (HTTPS) websites
(or any other service over TLS) to be served by the same IP address without requiring all those sites to use the same certificate.

CloudFront can use SNI to host multiple distributions on the same IP - which a large majority of clients will support.

If your clients cannot support SNI however - CloudFront can use dedicated IPs for your distribution - but there is a prorated monthly charge for
using this feature. By default, we use SNI - but you can optionally enable dedicated IPs (VIP).

See the CloudFront SSL for more details about pricing : https://aws.amazon.com/cloudfront/custom-ssl-domains/

---

##### `webAclId`<sup>Optional</sup> <a name="webAclId" id="cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingDistributionProps.property.webAclId"></a>

```typescript
public readonly webAclId: string;
```

- *Type:* string
- *Default:* No AWS Web Application Firewall web access control list (web ACL).

Unique identifier that specifies the AWS WAF web ACL to associate with this CloudFront distribution.

To specify a web ACL created using the latest version of AWS WAF, use the ACL ARN, for example
`arn:aws:wafv2:us-east-1:123456789012:global/webacl/ExampleWebACL/473e64fd-f30b-4765-81a0-62ad96dd167a`.
To specify a web ACL created using AWS WAF Classic, use the ACL ID, for example `473e64fd-f30b-4765-81a0-62ad96dd167a`.

> [https://docs.aws.amazon.com/cloudfront/latest/APIReference/API_CreateDistribution.html#API_CreateDistribution_RequestParameters.](https://docs.aws.amazon.com/cloudfront/latest/APIReference/API_CreateDistribution.html#API_CreateDistribution_RequestParameters.)

---

### NextjsExportS3DynamicRoutingSiteProps <a name="NextjsExportS3DynamicRoutingSiteProps" id="cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingSiteProps"></a>

Deploy a static export Next.js site to Cloudfront and S3 while maintaining the ability to use dynamic routes.

Deploys Cloudfront, a Cloudfront Function, an S3 Bucket, and an S3 Deployment.

With defaults set, if this construct is removed, all resources will be cleaned up.

#### Initializer <a name="Initializer" id="cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingSiteProps.Initializer"></a>

```typescript
import { NextjsExportS3DynamicRoutingSiteProps } from 'cdk-nextjs-export-s3-dynamic-routing'

const nextjsExportS3DynamicRoutingSiteProps: NextjsExportS3DynamicRoutingSiteProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingSiteProps.property.bucketProps">bucketProps</a></code> | <code>aws-cdk-lib.aws_s3.BucketProps</code> | Passthrough props to customize the S3 bucket. |
| <code><a href="#cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingSiteProps.property.distributionProps">distributionProps</a></code> | <code><a href="#cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingDistributionProps">NextjsExportS3DynamicRoutingDistributionProps</a></code> | Passthrough props to customize the Cloudfront distribution. |
| <code><a href="#cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingSiteProps.property.nextBuildDir">nextBuildDir</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingSiteProps.property.nextExportPath">nextExportPath</a></code> | <code>string</code> | The relative path to the Next.js project. |
| <code><a href="#cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingSiteProps.property.s3OriginProps">s3OriginProps</a></code> | <code>aws-cdk-lib.aws_cloudfront_origins.S3OriginProps</code> | Passthrough props to customize the S3 Origin. |

---

##### `bucketProps`<sup>Optional</sup> <a name="bucketProps" id="cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingSiteProps.property.bucketProps"></a>

```typescript
public readonly bucketProps: BucketProps;
```

- *Type:* aws-cdk-lib.aws_s3.BucketProps
- *Default:* { publicReadAccess: false, blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL, autoDeleteObjects: true, removalPolicy: cdk.RemovalPolicy.DESTROY, }

Passthrough props to customize the S3 bucket.

---

##### `distributionProps`<sup>Optional</sup> <a name="distributionProps" id="cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingSiteProps.property.distributionProps"></a>

```typescript
public readonly distributionProps: NextjsExportS3DynamicRoutingDistributionProps;
```

- *Type:* <a href="#cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingDistributionProps">NextjsExportS3DynamicRoutingDistributionProps</a>
- *Default:* Sets up the S3 Origin and Cache Policy.

Passthrough props to customize the Cloudfront distribution.

---

##### `nextBuildDir`<sup>Optional</sup> <a name="nextBuildDir" id="cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingSiteProps.property.nextBuildDir"></a>

```typescript
public readonly nextBuildDir: string;
```

- *Type:* string
- *Default:* ./.next

---

##### `nextExportPath`<sup>Optional</sup> <a name="nextExportPath" id="cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingSiteProps.property.nextExportPath"></a>

```typescript
public readonly nextExportPath: string;
```

- *Type:* string
- *Default:* ./out

The relative path to the Next.js project.

---

##### `s3OriginProps`<sup>Optional</sup> <a name="s3OriginProps" id="cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingSiteProps.property.s3OriginProps"></a>

```typescript
public readonly s3OriginProps: S3OriginProps;
```

- *Type:* aws-cdk-lib.aws_cloudfront_origins.S3OriginProps
- *Default:* S3 Origin defaults.

Passthrough props to customize the S3 Origin.

---



