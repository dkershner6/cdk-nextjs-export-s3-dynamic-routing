import { awscdk } from 'projen';
const project = new awscdk.AwsCdkConstructLibrary({
  majorVersion: 1,
  author: 'Derek Kershner',
  authorAddress: 'https://dkershner.com',
  cdkVersion: '2.77.0',
  defaultReleaseBranch: 'main',
  jsiiVersion: '~5.0.0',
  name: 'cdk-nextjs-export-s3-dynamic-routing',
  projenrcTs: true,
  repositoryUrl: 'https://github.com/dkershner6/cdk-nextjs-export-s3-dynamic-routing.git',

  deps: ['lodash.set', 'uglify-js'], /* Runtime dependencies of this module. */
  description: 'Deploy a static export Next.js site to Cloudfront and S3 while maintaining the ability to use dynamic routes.', /* The description is just a string that helps people understand the purpose of the package. */
  devDeps: ['@types/lodash.set', '@types/uglify-js'], /* Build dependencies for this module. */
  packageName: 'cdk-nextjs-export-s3-dynamic-routing', /* The "name" in package.json. */

  bundledDeps: ['lodash.set', 'uglify-js'], /* Runtime dependencies that will be bundled by esbuild. */

  tsconfig: {
    compilerOptions: {
      esModuleInterop: true,
    },
  },
});
project.synth();