package cdknextjsexports3dynamicrouting

import (
	"github.com/aws/aws-cdk-go/awscdk/v2/awscloudfront"
)

// Options for creating a new behavior.
//
// origin is optional here, not usually in the CDK.
type PartialBehaviorOptions struct {
	// HTTP methods to allow for this behavior.
	// Default: AllowedMethods.ALLOW_GET_HEAD
	//
	AllowedMethods awscloudfront.AllowedMethods `field:"optional" json:"allowedMethods" yaml:"allowedMethods"`
	// HTTP methods to cache for this behavior.
	// Default: CachedMethods.CACHE_GET_HEAD
	//
	CachedMethods awscloudfront.CachedMethods `field:"optional" json:"cachedMethods" yaml:"cachedMethods"`
	// The cache policy for this behavior.
	//
	// The cache policy determines what values are included in the cache key,
	// and the time-to-live (TTL) values for the cache.
	// See: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html.
	//
	// Default: CachePolicy.CACHING_OPTIMIZED
	//
	CachePolicy awscloudfront.ICachePolicy `field:"optional" json:"cachePolicy" yaml:"cachePolicy"`
	// Whether you want CloudFront to automatically compress certain files for this cache behavior.
	//
	// See https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/ServingCompressedFiles.html#compressed-content-cloudfront-file-types
	// for file types CloudFront will compress.
	// Default: true.
	//
	Compress *bool `field:"optional" json:"compress" yaml:"compress"`
	// The Lambda@Edge functions to invoke before serving the contents.
	// See: https://aws.amazon.com/lambda/edge
	//
	// Default: - no Lambda functions will be invoked.
	//
	EdgeLambdas *[]*awscloudfront.EdgeLambda `field:"optional" json:"edgeLambdas" yaml:"edgeLambdas"`
	// The CloudFront functions to invoke before serving the contents.
	// Default: - no functions will be invoked.
	//
	FunctionAssociations *[]*awscloudfront.FunctionAssociation `field:"optional" json:"functionAssociations" yaml:"functionAssociations"`
	// The origin request policy for this behavior.
	//
	// The origin request policy determines which values (e.g., headers, cookies)
	// are included in requests that CloudFront sends to the origin.
	// Default: - none.
	//
	OriginRequestPolicy awscloudfront.IOriginRequestPolicy `field:"optional" json:"originRequestPolicy" yaml:"originRequestPolicy"`
	// The response headers policy for this behavior.
	//
	// The response headers policy determines which headers are included in responses.
	// Default: - none.
	//
	ResponseHeadersPolicy awscloudfront.IResponseHeadersPolicy `field:"optional" json:"responseHeadersPolicy" yaml:"responseHeadersPolicy"`
	// Set this to true to indicate you want to distribute media files in the Microsoft Smooth Streaming format using this behavior.
	// Default: false.
	//
	SmoothStreaming *bool `field:"optional" json:"smoothStreaming" yaml:"smoothStreaming"`
	// A list of Key Groups that CloudFront can use to validate signed URLs or signed cookies.
	// See: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PrivateContent.html
	//
	// Default: - no KeyGroups are associated with cache behavior.
	//
	TrustedKeyGroups *[]awscloudfront.IKeyGroup `field:"optional" json:"trustedKeyGroups" yaml:"trustedKeyGroups"`
	// The protocol that viewers can use to access the files controlled by this behavior.
	// Default: ViewerProtocolPolicy.ALLOW_ALL
	//
	ViewerProtocolPolicy awscloudfront.ViewerProtocolPolicy `field:"optional" json:"viewerProtocolPolicy" yaml:"viewerProtocolPolicy"`
	// The origin that you want CloudFront to route requests to when they match this behavior.
	Origin awscloudfront.IOrigin `field:"optional" json:"origin" yaml:"origin"`
}

