import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Repository, TagMutability } from "aws-cdk-lib/aws-ecr";

export class EcrStack extends cdk.Stack {
    public readonly authServiceRepo: Repository;
    public readonly stripeServiceRepo: Repository;
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        this.authServiceRepo = new Repository(this, "AuthServiceRepo", {
            repositoryName: "auth-service",
            imageTagMutability: TagMutability.IMMUTABLE,
        });

        this.stripeServiceRepo = new Repository(this, "StripeServiceRepo", {
            repositoryName: "stripe-service",
            imageTagMutability: TagMutability.IMMUTABLE,
        });
    }
}
