import { awscdk } from 'projen';
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Derek Kershner',
  authorAddress: 'https://dkershner.com',
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  jsiiVersion: '~5.0.0',
  name: 'cdk-nextjs-export-s3-dynamic-routing',
  projenrcTs: true,
  repositoryUrl: 'https://github.com/dkershner6/cdk-nextjs-export-s3-dynamic-routing.git',

  deps: ['lodash.set'], /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  devDeps: ['@types/lodash.set'], /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
  bundledDeps: ['lodash.set'], /* Bundled dependencies of this module. */

  tsconfig: {
    compilerOptions: {
      esModuleInterop: true,
    },
  },
});
project.synth();