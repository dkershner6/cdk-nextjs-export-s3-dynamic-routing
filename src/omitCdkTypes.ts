import * as acm from "aws-cdk-lib/aws-certificatemanager";
import {
    AddBehaviorOptions,
    BehaviorOptions,
    ErrorResponse,
    GeoRestriction,
    HttpVersion,
    IOrigin,
    PriceClass,
    SSLMethod,
    SecurityPolicyProtocol,
} from "aws-cdk-lib/aws-cloudfront";
import * as s3 from "aws-cdk-lib/aws-s3";

/**
 * Options for creating a new behavior.
 * origin is optional here, not usually in the CDK.
 */
export interface PartialBehaviorOptions extends AddBehaviorOptions {
    /**
     * The origin that you want CloudFront to route requests to when they match this behavior.
     */
    readonly origin?: IOrigin;
}

/**
 * Differences from cloudfront.DistributionProps:
 * - defaultBehavior is optional
 */
export interface NextjsExportS3DynamicRoutingDistributionProps {
    /**
     * The default behavior for the distribution.
     * Optional and Partial here, not usually either in the CDK.
     */
    readonly defaultBehavior?: PartialBehaviorOptions;
    /**
     * Additional behaviors for the distribution, mapped by the pathPattern that specifies which requests to apply the behavior to.
     *
     * @default - no additional behaviors are added.
     */
    readonly additionalBehaviors?: Record<string, BehaviorOptions>;
    /**
     * A certificate to associate with the distribution. The certificate must be located in N. Virginia (us-east-1).
     *
     * @default - the CloudFront wildcard certificate (*.cloudfront.net) will be used.
     */
    readonly certificate?: acm.ICertificate;
    /**
     * Any comments you want to include about the distribution.
     *
     * @default - no comment
     */
    readonly comment?: string;
    /**
     * The object that you want CloudFront to request from your origin (for example, index.html)
     * when a viewer requests the root URL for your distribution. If no default object is set, the
     * request goes to the origin's root (e.g., example.com/).
     *
     * @default - no default root object
     */
    readonly defaultRootObject?: string;
    /**
     * Alternative domain names for this distribution.
     *
     * If you want to use your own domain name, such as www.example.com, instead of the cloudfront.net domain name,
     * you can add an alternate domain name to your distribution. If you attach a certificate to the distribution,
     * you must add (at least one of) the domain names of the certificate to this list.
     *
     * @default - The distribution will only support the default generated name (e.g., d111111abcdef8.cloudfront.net)
     */
    readonly domainNames?: string[];
    /**
     * Enable or disable the distribution.
     *
     * @default true
     */
    readonly enabled?: boolean;
    /**
     * Whether CloudFront will respond to IPv6 DNS requests with an IPv6 address.
     *
     * If you specify false, CloudFront responds to IPv6 DNS requests with the DNS response code NOERROR and with no IP addresses.
     * This allows viewers to submit a second request, for an IPv4 address for your distribution.
     *
     * @default true
     */
    readonly enableIpv6?: boolean;
    /**
     * Enable access logging for the distribution.
     *
     * @default - false, unless `logBucket` is specified.
     */
    readonly enableLogging?: boolean;
    /**
     * Controls the countries in which your content is distributed.
     *
     * @default - No geographic restrictions
     */
    readonly geoRestriction?: GeoRestriction;
    /**
     * Specify the maximum HTTP version that you want viewers to use to communicate with CloudFront.
     *
     * For viewers and CloudFront to use HTTP/2, viewers must support TLS 1.2 or later, and must support server name identification (SNI).
     *
     * @default HttpVersion.HTTP2
     */
    readonly httpVersion?: HttpVersion;
    /**
     * The Amazon S3 bucket to store the access logs in.
     * Make sure to set `objectOwnership` to `s3.ObjectOwnership.OBJECT_WRITER` in your custom bucket.
     *
     * @default - A bucket is created if `enableLogging` is true
     */
    readonly logBucket?: s3.IBucket;
    /**
     * Specifies whether you want CloudFront to include cookies in access logs
     *
     * @default false
     */
    readonly logIncludesCookies?: boolean;
    /**
     * An optional string that you want CloudFront to prefix to the access log filenames for this distribution.
     *
     * @default - no prefix
     */
    readonly logFilePrefix?: string;
    /**
     * The price class that corresponds with the maximum price that you want to pay for CloudFront service.
     * If you specify PriceClass_All, CloudFront responds to requests for your objects from all CloudFront edge locations.
     * If you specify a price class other than PriceClass_All, CloudFront serves your objects from the CloudFront edge location
     * that has the lowest latency among the edge locations in your price class.
     *
     * @default PriceClass.PRICE_CLASS_ALL
     */
    readonly priceClass?: PriceClass;
    /**
     * Unique identifier that specifies the AWS WAF web ACL to associate with this CloudFront distribution.
     *
     * To specify a web ACL created using the latest version of AWS WAF, use the ACL ARN, for example
     * `arn:aws:wafv2:us-east-1:123456789012:global/webacl/ExampleWebACL/473e64fd-f30b-4765-81a0-62ad96dd167a`.
     * To specify a web ACL created using AWS WAF Classic, use the ACL ID, for example `473e64fd-f30b-4765-81a0-62ad96dd167a`.
     *
     * @see https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html
     * @see https://docs.aws.amazon.com/cloudfront/latest/APIReference/API_CreateDistribution.html#API_CreateDistribution_RequestParameters.
     *
     * @default - No AWS Web Application Firewall web access control list (web ACL).
     */
    readonly webAclId?: string;
    /**
     * How CloudFront should handle requests that are not successful (e.g., PageNotFound).
     *
     * @default - No custom error responses.
     */
    readonly errorResponses?: ErrorResponse[];
    /**
     * The minimum version of the SSL protocol that you want CloudFront to use for HTTPS connections.
     *
     * CloudFront serves your objects only to browsers or devices that support at
     * least the SSL version that you specify.
     *
     * @default - SecurityPolicyProtocol.TLS_V1_2_2021 if the '@aws-cdk/aws-cloudfront:defaultSecurityPolicyTLSv1.2_2021' feature flag is set; otherwise, SecurityPolicyProtocol.TLS_V1_2_2019.
     */
    readonly minimumProtocolVersion?: SecurityPolicyProtocol;
    /**
     * The SSL method CloudFront will use for your distribution.
     *
     * Server Name Indication (SNI) - is an extension to the TLS computer networking protocol by which a client indicates
     * which hostname it is attempting to connect to at the start of the handshaking process. This allows a server to present
     * multiple certificates on the same IP address and TCP port number and hence allows multiple secure (HTTPS) websites
     * (or any other service over TLS) to be served by the same IP address without requiring all those sites to use the same certificate.
     *
     * CloudFront can use SNI to host multiple distributions on the same IP - which a large majority of clients will support.
     *
     * If your clients cannot support SNI however - CloudFront can use dedicated IPs for your distribution - but there is a prorated monthly charge for
     * using this feature. By default, we use SNI - but you can optionally enable dedicated IPs (VIP).
     *
     * See the CloudFront SSL for more details about pricing : https://aws.amazon.com/cloudfront/custom-ssl-domains/
     *
     * @default SSLMethod.SNI
     */
    readonly sslSupportMethod?: SSLMethod;
}
