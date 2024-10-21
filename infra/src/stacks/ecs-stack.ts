import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import {  Vpc } from "aws-cdk-lib/aws-ec2";
import {
    Cluster,
} from "aws-cdk-lib/aws-ecs";
import {
    ApplicationLoadBalancer,
} from "aws-cdk-lib/aws-elasticloadbalancingv2";
import { SsmSecrets} from "../constructs/ssmSecrets";
import { Services } from "../services";
import { EcsService } from "../constructs/ecsService";

type EcsStackProps = cdk.StackProps & Services;

export class EcsStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: EcsStackProps) {
        super(scope, id, props);

        const { authService, stripeService } = props;

        // SECRETS
        const authServiceSecrets = new SsmSecrets(this, "AuthServiceSecrets", {
            secretPath: authService.secretPath,
            secretsNames: authService.secretsNames,
        });
        const stripeServiceSecrets = new SsmSecrets(this, "StripeServiceSecrets", {
            secretPath: stripeService.secretPath,
            secretsNames: stripeService.secretsNames,
        })

        // VPC & CLUSTER
        const vpc = new Vpc(this, "EcsVpc", {
            maxAzs: 2,
            natGateways: 1,
        });

        const cluster = new Cluster(this, "BunCdkCluster", {
            vpc,
        });

        const alb = new ApplicationLoadBalancer(this, "BunCdkAlb", {
            vpc,
            internetFacing: true,
        });

        // SERVICES
        new EcsService(this, "AuthService", {
            serviceName: authService.serviceName,
            containerPort: authService.containerPort,
            containerImage: authService.containerImage,
            memoryLimit: authService.memoryLimit ?? 256,
            cpuLimit: authService.cpuLimit ?? 256,
            secrets: authServiceSecrets.secrets,
            cluster,
            vpc,
            lb: alb,
        })

        new EcsService(this, "StripeService", {
            serviceName: stripeService.serviceName,
            containerPort: stripeService.containerPort,
            containerImage: stripeService.containerImage,
            memoryLimit: stripeService.memoryLimit ?? 256,
            cpuLimit: stripeService.cpuLimit ?? 256,
            secrets: stripeServiceSecrets.secrets,
            cluster,
            vpc,
            lb: alb,
        });
    }
}
