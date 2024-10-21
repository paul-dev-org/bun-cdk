import { ContainerImage } from "aws-cdk-lib/aws-ecs";

type ServiceProps = {
    secretPath: string;
    secretsNames: string;
    serviceName: string;
    containerPort: number;
    containerImage: ContainerImage;
    memoryLimit?: number;
    cpuLimit?: number;
};

export type Services = {
    authService: ServiceProps;
    stripeService: ServiceProps;
}
