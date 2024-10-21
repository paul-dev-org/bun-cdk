#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { EcsStack} from "./stacks/ecs-stack";
import { ContainerImage } from "aws-cdk-lib/aws-ecs";
import { join } from "path";
import { EcrStack } from "./stacks/ecr-stack";
import { GithubOidc } from "./stacks/github-oidc";

const app = new cdk.App();

const ecrs = new EcrStack(app, "BunCdkEcrStack", {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
    },
});

new EcsStack(app, "BunCdkStack", {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
    },
    authService: {
        secretPath: process.env.AUTH_SERVICE_ENVS_PATH || "",
        secretsNames: process.env.AUTH_SERVICE_ENVS || "",
        serviceName: "auth-service",
        containerPort: 3000,
        containerImage: ContainerImage.fromAsset(join(__dirname, "../../apps/auth-service")),
    },
    stripeService: {
        secretPath: process.env.STRIPE_SERVICE_ENVS_PATH || "",
        secretsNames: process.env.STRIPE_SERVICE_ENVS || "",
        serviceName: "stripe-service",
        containerPort: 3001,
        containerImage: ContainerImage.fromAsset(join(__dirname, "../../apps/stripe-service")),
    },
    ecrs,
});

new GithubOidc(app, "BunCdkGithubOidc", {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
    },
    repositoryConfig: [
        {
            owner: "paul-dev-org",
            repo: "bun-cdk",
        },
    ],
});
