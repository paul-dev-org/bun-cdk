import { Construct } from "constructs";
import {
    Cluster,
    ContainerImage,
    FargateService,
    FargateTaskDefinition,
    LogDriver,
    Protocol,
    Secret,
} from "aws-cdk-lib/aws-ecs";
import { Duration } from "aws-cdk-lib";
import { Peer, Port, SecurityGroup, Vpc } from "aws-cdk-lib/aws-ec2";
import { ApplicationLoadBalancer, ApplicationProtocol } from "aws-cdk-lib/aws-elasticloadbalancingv2";

type ServiceProps = {
    serviceName: string;
    containerPort: number;
    containerImage: ContainerImage;
    memoryLimit?: number;
    cpuLimit?: number;
    secrets?: { [key: string]: Secret };
    cluster: Cluster;
    vpc: Vpc,
    lb: ApplicationLoadBalancer;
};

export class EcsService extends Construct {

    constructor(scope: Construct, id: string, props: ServiceProps) {
        super(scope, id);

        const sg = new SecurityGroup(
            this,
            `${id}SecurityGroup`,
            { vpc: props.vpc }
        );

        sg.addIngressRule(Peer.ipv4("0.0.0.0/0"), Port.tcp(props.containerPort));

        const taskDef = new FargateTaskDefinition(this, `${id}TaskDef`);
        const container = taskDef.addContainer(props.serviceName, {
            secrets: props.secrets ?? {},
            image: props.containerImage,
            memoryLimitMiB: props.memoryLimit ?? 512,
            cpu: props.cpuLimit ?? 256,
            logging: LogDriver.awsLogs({ streamPrefix: props.serviceName }),
/*            healthCheck: {
                command: [
                    "CMD-SHELL",
                    `curl -f http://localhost:${props.containerPort}/ || exit 1`
                ],
                interval: Duration.seconds(60),
                timeout: Duration.seconds(5),
                retries: 3,
                startPeriod: Duration.seconds(60),
            },*/
        });

        container.addPortMappings({
            containerPort: props.containerPort,
            protocol: Protocol.TCP,
        });

        const service = new FargateService(this, "AuthService", {
            cluster: props.cluster,
            taskDefinition: taskDef,
            securityGroups: [sg],
        });


        // LB Listener
        const authListener = props.lb.addListener(`${id}${props.serviceName}`, {
            port: props.containerPort,
            open: true,
            protocol: ApplicationProtocol.HTTP,
        });

        authListener.addTargets(props.serviceName, {
            port: props.containerPort,
            protocol: ApplicationProtocol.HTTP,
            targets: [
                service.loadBalancerTarget({
                    containerName: props.serviceName,
                    containerPort: props.containerPort,
                }),
            ],
            healthCheck: {
                interval: Duration.seconds(60),
                path: "/",
                timeout: Duration.seconds(5),
            },
        });
    }
}
