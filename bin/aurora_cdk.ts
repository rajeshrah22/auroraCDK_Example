#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { AuroraCdkStack } from '../lib/aurora_cdk-stack';

const app = new cdk.App();
new AuroraCdkStack(app, 'AuroraCdkStack');
