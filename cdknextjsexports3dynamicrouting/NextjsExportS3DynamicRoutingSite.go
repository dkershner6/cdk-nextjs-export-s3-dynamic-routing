package cdknextjsexports3dynamicrouting

import (
	_jsii_ "github.com/aws/jsii-runtime-go/runtime"
	_init_ "github.com/dkershner6/cdk-nextjs-export-s3-dynamic-routing/cdknextjsexports3dynamicrouting/jsii"

	"github.com/aws/aws-cdk-go/awscdk/v2/awscloudfront"
	"github.com/aws/aws-cdk-go/awscdk/v2/awss3"
	"github.com/aws/constructs-go/constructs/v10"
	"github.com/dkershner6/cdk-nextjs-export-s3-dynamic-routing/cdknextjsexports3dynamicrouting/internal"
)

// Deploy an exported, static site using Next.js. Compatible with a Next 13 project using /pages routing.
// See: For Static Site Limitations: https://nextjs.org/docs/advanced-features/static-html-export
//
// Additional Limitations:
// - Cloudfront function size is capped at 10KB. This may be exceeded if the amount of pages (page types, not static pages with many static paths) is extremely large, as each represents a JSON object in the code.
// - For estimation, if we assume around 1000 characters of natural overhead and average 100 characters per page type, this calculates to about 90 page types (files in the pages folder).
//
type NextjsExportS3DynamicRoutingSite interface {
	constructs.Construct
	CloudfrontDistribution() awscloudfront.Distribution
	// The tree node.
	Node() constructs.Node
	S3Bucket() awss3.Bucket
	ViewerRequestCloudfrontFunction() awscloudfront.Function
	// Returns a string representation of this construct.
	ToString() *string
}

// The jsii proxy struct for NextjsExportS3DynamicRoutingSite
type jsiiProxy_NextjsExportS3DynamicRoutingSite struct {
	internal.Type__constructsConstruct
}

func (j *jsiiProxy_NextjsExportS3DynamicRoutingSite) CloudfrontDistribution() awscloudfront.Distribution {
	var returns awscloudfront.Distribution
	_jsii_.Get(
		j,
		"cloudfrontDistribution",
		&returns,
	)
	return returns
}

func (j *jsiiProxy_NextjsExportS3DynamicRoutingSite) Node() constructs.Node {
	var returns constructs.Node
	_jsii_.Get(
		j,
		"node",
		&returns,
	)
	return returns
}

func (j *jsiiProxy_NextjsExportS3DynamicRoutingSite) S3Bucket() awss3.Bucket {
	var returns awss3.Bucket
	_jsii_.Get(
		j,
		"s3Bucket",
		&returns,
	)
	return returns
}

func (j *jsiiProxy_NextjsExportS3DynamicRoutingSite) ViewerRequestCloudfrontFunction() awscloudfront.Function {
	var returns awscloudfront.Function
	_jsii_.Get(
		j,
		"viewerRequestCloudfrontFunction",
		&returns,
	)
	return returns
}


func NewNextjsExportS3DynamicRoutingSite(scope constructs.Construct, id *string, props *NextjsExportS3DynamicRoutingSiteProps) NextjsExportS3DynamicRoutingSite {
	_init_.Initialize()

	if err := validateNewNextjsExportS3DynamicRoutingSiteParameters(scope, id, props); err != nil {
		panic(err)
	}
	j := jsiiProxy_NextjsExportS3DynamicRoutingSite{}

	_jsii_.Create(
		"cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingSite",
		[]interface{}{scope, id, props},
		&j,
	)

	return &j
}

func NewNextjsExportS3DynamicRoutingSite_Override(n NextjsExportS3DynamicRoutingSite, scope constructs.Construct, id *string, props *NextjsExportS3DynamicRoutingSiteProps) {
	_init_.Initialize()

	_jsii_.Create(
		"cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingSite",
		[]interface{}{scope, id, props},
		n,
	)
}

// Checks if `x` is a construct.
//
// Returns: true if `x` is an object created from a class which extends `Construct`.
// Deprecated: use `x instanceof Construct` instead.
func NextjsExportS3DynamicRoutingSite_IsConstruct(x interface{}) *bool {
	_init_.Initialize()

	if err := validateNextjsExportS3DynamicRoutingSite_IsConstructParameters(x); err != nil {
		panic(err)
	}
	var returns *bool

	_jsii_.StaticInvoke(
		"cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingSite",
		"isConstruct",
		[]interface{}{x},
		&returns,
	)

	return returns
}

func NextjsExportS3DynamicRoutingSite_RECOMMENDED_CACHE_POLICY() *awscloudfront.CachePolicyProps {
	_init_.Initialize()
	var returns *awscloudfront.CachePolicyProps
	_jsii_.StaticGet(
		"cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingSite",
		"RECOMMENDED_CACHE_POLICY",
		&returns,
	)
	return returns
}

func (n *jsiiProxy_NextjsExportS3DynamicRoutingSite) ToString() *string {
	var returns *string

	_jsii_.Invoke(
		n,
		"toString",
		nil, // no parameters
		&returns,
	)

	return returns
}

