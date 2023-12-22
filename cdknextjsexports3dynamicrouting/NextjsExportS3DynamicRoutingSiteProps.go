package cdknextjsexports3dynamicrouting

import (
	"github.com/aws/aws-cdk-go/awscdk/v2/awscloudfrontorigins"
	"github.com/aws/aws-cdk-go/awscdk/v2/awss3"
)

// Deploy a static export Next.js site to Cloudfront and S3 while maintaining the ability to use dynamic routes.
//
// Deploys Cloudfront, a Cloudfront Function, an S3 Bucket, and an S3 Deployment.
//
// With defaults set, if this construct is removed, all resources will be cleaned up.
type NextjsExportS3DynamicRoutingSiteProps struct {
	// Passthrough props to customize the S3 bucket.
	// Default: {
	// publicReadAccess: false,
	// blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
	// autoDeleteObjects: true,
	// removalPolicy: cdk.RemovalPolicy.DESTROY,
	// }.
	//
	BucketProps *awss3.BucketProps `field:"optional" json:"bucketProps" yaml:"bucketProps"`
	// Passthrough props to customize the Cloudfront distribution.
	// Default: Sets up the S3 Origin and Cache Policy.
	//
	DistributionProps *NextjsExportS3DynamicRoutingDistributionProps `field:"optional" json:"distributionProps" yaml:"distributionProps"`
	// Default: ./.next
	//
	NextBuildDir *string `field:"optional" json:"nextBuildDir" yaml:"nextBuildDir"`
	// The relative path to the Next.js project.
	// Default: ./out
	//
	NextExportPath *string `field:"optional" json:"nextExportPath" yaml:"nextExportPath"`
	// Passthrough props to customize the S3 Origin.
	// Default: S3 Origin defaults.
	//
	S3OriginProps *awscloudfrontorigins.S3OriginProps `field:"optional" json:"s3OriginProps" yaml:"s3OriginProps"`
}

