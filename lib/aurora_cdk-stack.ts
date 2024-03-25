import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { aws_apigatewayv2 } from 'aws-cdk-lib';
import { aws_lambda } from 'aws-cdk-lib';
import { aws_rds } from 'aws-cdk-lib';
import { aws_apigatewayv2_integrations } from 'aws-cdk-lib';
import { aws_ec2 } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class AuroraCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new aws_ec2.Vpc(this, 'auroraVPC');

    // aurora cluster
    const cluster = new aws_rds.ServerlessCluster(this, 'AuroraTestCluster', {
      engine: aws_rds.DatabaseClusterEngine.AURORA_POSTGRESQL,
      parameterGroup: aws_rds.ParameterGroup.fromParameterGroupName(this, 'ParameterGroup',
          'default.aurora-postgresql10'),
      defaultDatabaseName: 'TestDB',
      vpc,
      scaling: { autoPause: Duration.seconds(0) }
    });


    const postFn = new aws_lambda.Function(this, 'MyFunction', {
      runtime: aws_lambda.Runtime.NODEJS_20_X,
      code: new aws_lambda.AssetCode('lambda-functions'),
      handler: 'index.handler',
      memorySize: 1024,
      environment: {
        CLUSTER_ARN: cluster.clusterArn,
        SECRET_ARN: cluster.secret?.secretArn || '',
        DB_NAME: 'TestDB',
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1'
      }
    })


    cluster.grantDataApiAccess(postFn);
  }
}
