import { Node20AwsCdkConstructLibrary } from "dkershner6-projen-typescript";
import { Nvmrc } from "projen-nvm";

const GITHUB_USERNAME_OR_ORG = "dkershner6";
const GITHUB_USERNAME_OR_ORG_PASCAL_CASE = "DKershner6";
const PROJECT_NAME = "cdk-nextjs-export-s3-dynamic-routing";
const PROJECT_NAME_PASCAL_CASE = "CdkNextjsExportS3DynamicRouting";

const project = new Node20AwsCdkConstructLibrary({
    majorVersion: 1,
    author: "Derek Kershner",
    authorAddress: "https://dkershner.com",
    cdkVersion: "2.77.0",
    defaultReleaseBranch: "main",
    jsiiVersion: "~5.0.0",
    name: PROJECT_NAME,
    projenrcTs: true,
    repositoryUrl:
        "https://github.com/dkershner6/cdk-nextjs-export-s3-dynamic-routing.git",

    deps: ["lodash.set", "uglify-js"],
    description:
        "Deploy a static export Next.js site to Cloudfront and S3 while maintaining the ability to use dynamic routes." /* The description is just a string that helps people understand the purpose of the package. */,
    devDeps: [
        "@types/lodash.set",
        "@types/uglify-js",
        "dkershner6-projen-typescript",
        "projen-nvm",
    ],
    packageName: PROJECT_NAME,
    bundledDeps: ["lodash.set", "uglify-js"],

    gitignore: [".DS_Store"],

    // Publish to other languages
    publishToPypi: {
        distName: PROJECT_NAME,
        module: PROJECT_NAME.replace("-", "_"),
    },

    publishToNuget: {
        packageId: `${GITHUB_USERNAME_OR_ORG_PASCAL_CASE}.${PROJECT_NAME_PASCAL_CASE}`,
        dotNetNamespace: `${GITHUB_USERNAME_OR_ORG_PASCAL_CASE}.${PROJECT_NAME_PASCAL_CASE}`,
    },

    publishToGo: {
        moduleName: `github.com/${GITHUB_USERNAME_OR_ORG}/${PROJECT_NAME}`,
    },

    // publishToMaven: {
    //     mavenGroupId: `io.github.${GITHUB_USERNAME_OR_ORG}`,
    //     javaPackage: `io.github.${GITHUB_USERNAME_OR_ORG}.${PROJECT_NAME.replace(
    //         "-",
    //         "",
    //     )}`,
    //     mavenArtifactId: PROJECT_NAME,
    //     mavenEndpoint: "https://s01.oss.sonatype.org",
    // },
});

new Nvmrc(project);

project.synth();
