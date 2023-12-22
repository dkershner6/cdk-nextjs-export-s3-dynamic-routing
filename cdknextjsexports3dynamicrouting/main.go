// Deploy a static export Next.js site to Cloudfront and S3 while maintaining the ability to use dynamic routes.
package cdknextjsexports3dynamicrouting

import (
	"reflect"

	_jsii_ "github.com/aws/jsii-runtime-go/runtime"
)

func init() {
	_jsii_.RegisterStruct(
		"cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingDistributionProps",
		reflect.TypeOf((*NextjsExportS3DynamicRoutingDistributionProps)(nil)).Elem(),
	)
	_jsii_.RegisterClass(
		"cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingSite",
		reflect.TypeOf((*NextjsExportS3DynamicRoutingSite)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberProperty{JsiiProperty: "cloudfrontDistribution", GoGetter: "CloudfrontDistribution"},
			_jsii_.MemberProperty{JsiiProperty: "node", GoGetter: "Node"},
			_jsii_.MemberProperty{JsiiProperty: "s3Bucket", GoGetter: "S3Bucket"},
			_jsii_.MemberMethod{JsiiMethod: "toString", GoMethod: "ToString"},
			_jsii_.MemberProperty{JsiiProperty: "viewerRequestCloudfrontFunction", GoGetter: "ViewerRequestCloudfrontFunction"},
		},
		func() interface{} {
			j := jsiiProxy_NextjsExportS3DynamicRoutingSite{}
			_jsii_.InitJsiiProxy(&j.Type__constructsConstruct)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"cdk-nextjs-export-s3-dynamic-routing.NextjsExportS3DynamicRoutingSiteProps",
		reflect.TypeOf((*NextjsExportS3DynamicRoutingSiteProps)(nil)).Elem(),
	)
	_jsii_.RegisterStruct(
		"cdk-nextjs-export-s3-dynamic-routing.PartialBehaviorOptions",
		reflect.TypeOf((*PartialBehaviorOptions)(nil)).Elem(),
	)
}
