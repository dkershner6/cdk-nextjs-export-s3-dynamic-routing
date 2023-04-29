# Next.js Static Export S3 Site with Dynamic Routing

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



## Classes <a name="Classes" id="Classes"></a>

### Hello <a name="Hello" id="cdk-nextjs-export-s3-dynamic-routing.Hello"></a>

#### Initializers <a name="Initializers" id="cdk-nextjs-export-s3-dynamic-routing.Hello.Initializer"></a>

```typescript
import { Hello } from 'cdk-nextjs-export-s3-dynamic-routing'

new Hello()
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-nextjs-export-s3-dynamic-routing.Hello.sayHello">sayHello</a></code> | *No description.* |

---

##### `sayHello` <a name="sayHello" id="cdk-nextjs-export-s3-dynamic-routing.Hello.sayHello"></a>

```typescript
public sayHello(): string
```




