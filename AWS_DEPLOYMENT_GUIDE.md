# AWS Deployment Guide

This guide provides step-by-step instructions for deploying the Campaign Management Application to AWS.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [AWS Services Overview](#aws-services-overview)
3. [Quick Start with Docker on EC2](#quick-start-with-docker-on-ec2)
4. [Production Deployment Options](#production-deployment-options)
5. [AWS RDS PostgreSQL Setup](#aws-rds-postgresql-setup)
6. [AWS S3 File Storage Setup](#aws-s3-file-storage-setup)
7. [Environment Variables](#environment-variables)
8. [Deployment with ECS/Fargate](#deployment-with-ecsfargate)
9. [Setting up Load Balancer](#setting-up-load-balancer)
10. [Security Best Practices](#security-best-practices)
11. [Monitoring and Logging](#monitoring-and-logging)
12. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- AWS account with appropriate permissions
- AWS CLI installed and configured (`aws configure`)
- Docker installed locally (for building images)
- Node.js 20+ (for local development)
- Domain name (optional, for custom domains)

## AWS Services Overview

This application uses the following AWS services:

- **EC2 or ECS/Fargate**: Application hosting
- **RDS PostgreSQL**: Database
- **S3**: File storage (optional, can use local storage)
- **Application Load Balancer (ALB)**: Load balancing and SSL termination
- **CloudWatch**: Logging and monitoring
- **ECR**: Docker image registry (for ECS deployments)

Estimated monthly cost (us-east-1, moderate usage):
- t3.small EC2: ~$15/month
- db.t3.micro RDS: ~$15/month
- S3 storage (10GB): ~$0.25/month
- ALB: ~$16/month
- **Total: ~$46/month** (varies with usage)

---

## Quick Start with Docker on EC2

This is the fastest way to deploy your application to AWS.

### 1. Launch an EC2 Instance

```bash
# Create a security group
aws ec2 create-security-group \
  --group-name campaign-app-sg \
  --description "Security group for Campaign App"

# Allow HTTP, HTTPS, and SSH
aws ec2 authorize-security-group-ingress \
  --group-name campaign-app-sg \
  --protocol tcp --port 22 --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
  --group-name campaign-app-sg \
  --protocol tcp --port 80 --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
  --group-name campaign-app-sg \
  --protocol tcp --port 443 --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
  --group-name campaign-app-sg \
  --protocol tcp --port 5000 --cidr 0.0.0.0/0

# Launch EC2 instance (Ubuntu 22.04)
aws ec2 run-instances \
  --image-id ami-0c7217cdde317cfec \
  --instance-type t3.small \
  --key-name your-key-pair \
  --security-groups campaign-app-sg \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=campaign-app}]'
```

### 2. Connect to Your EC2 Instance

```bash
# Get the public IP
aws ec2 describe-instances \
  --filters "Name=tag:Name,Values=campaign-app" \
  --query "Reservations[0].Instances[0].PublicIpAddress"

# SSH into the instance
ssh -i your-key-pair.pem ubuntu@<EC2_PUBLIC_IP>
```

### 3. Install Docker on EC2

```bash
# Update package index
sudo apt-get update

# Install Docker
sudo apt-get install -y docker.io docker-compose

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add ubuntu user to docker group
sudo usermod -aG docker ubuntu

# Log out and back in for group changes to take effect
exit
# SSH back in
ssh -i your-key-pair.pem ubuntu@<EC2_PUBLIC_IP>
```

### 4. Deploy Your Application

```bash
# Clone your repository (or upload your code)
git clone https://github.com/your-username/campaign-app.git
cd campaign-app

# Create .env file with production settings
cat > .env << EOF
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://username:password@your-rds-endpoint.us-east-1.rds.amazonaws.com:5432/campaigndb
SESSION_SECRET=$(openssl rand -hex 32)
ENCRYPTION_KEY=$(openssl rand -hex 32)
DASHBOARD_PASSWORD=your-secure-password
ALLOWED_ORIGINS=https://yourdomain.com
FILE_STORAGE=local
EOF

# Build and run with Docker
docker build -t campaign-app .
docker run -d \
  --name campaign-app \
  --restart unless-stopped \
  -p 5000:5000 \
  --env-file .env \
  -v $(pwd)/uploads:/app/uploads \
  campaign-app

# Check logs
docker logs -f campaign-app
```

### 5. Access Your Application

Your app should now be accessible at `http://<EC2_PUBLIC_IP>:5000`

---

## Production Deployment Options

### Option 1: EC2 with Docker (Simple)
✅ Easy to set up and manage  
✅ Full control over the environment  
❌ Manual scaling required  
❌ No automatic failover  

**Best for**: Small to medium applications, development/staging environments

### Option 2: ECS with Fargate (Managed)
✅ Automatic scaling  
✅ No server management  
✅ Built-in load balancing  
❌ More complex setup  
❌ Slightly higher cost  

**Best for**: Production applications, high availability requirements

---

## AWS RDS PostgreSQL Setup

### 1. Create RDS Instance via AWS Console

1. Go to **RDS** → **Create database**
2. Select **PostgreSQL**
3. Choose **Free tier** (for testing) or **Production** template
4. Configure:
   - **DB instance identifier**: `campaign-db`
   - **Master username**: `postgres`
   - **Master password**: (strong password)
   - **DB instance class**: `db.t3.micro` (or larger for production)
   - **Storage**: 20 GB General Purpose SSD (gp3)
   - **VPC**: Same as your EC2 instance
   - **Public access**: Yes (if accessing from EC2, choose No and use security groups)
   - **VPC security group**: Create new or use existing
   - **Database name**: `campaigndb`
5. Click **Create database**

### 2. Configure Security Group

Allow PostgreSQL access (port 5432) from your EC2 instance or IP:

```bash
aws ec2 authorize-security-group-ingress \
  --group-id <RDS_SECURITY_GROUP_ID> \
  --protocol tcp \
  --port 5432 \
  --source-group <EC2_SECURITY_GROUP_ID>
```

### 3. Get Connection String

After the RDS instance is created:

```bash
# Get the endpoint
aws rds describe-db-instances \
  --db-instance-identifier campaign-db \
  --query "DBInstances[0].Endpoint.Address"
```

Your `DATABASE_URL` will be:
```
postgresql://postgres:your-password@campaign-db.xxxxxx.us-east-1.rds.amazonaws.com:5432/campaigndb
```

### 4. Initialize Database Schema

```bash
# SSH into your EC2 instance
ssh -i your-key-pair.pem ubuntu@<EC2_PUBLIC_IP>

# Run database migration
cd campaign-app
npm run db:push
```

---

## AWS S3 File Storage Setup

### 1. Create S3 Bucket

```bash
# Create bucket (bucket name must be globally unique)
aws s3 mb s3://campaign-app-uploads-$(date +%s) --region us-east-1

# Enable versioning (optional but recommended)
aws s3api put-bucket-versioning \
  --bucket campaign-app-uploads-xxxxx \
  --versioning-configuration Status=Enabled

# Set bucket policy for private access
cat > bucket-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::YOUR_ACCOUNT_ID:role/YourEC2Role"
      },
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::campaign-app-uploads-xxxxx/*"
    }
  ]
}
EOF

aws s3api put-bucket-policy \
  --bucket campaign-app-uploads-xxxxx \
  --policy file://bucket-policy.json
```

### 2. Create IAM User for S3 Access

```bash
# Create IAM user
aws iam create-user --user-name campaign-app-s3-user

# Create and attach policy
cat > s3-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::campaign-app-uploads-xxxxx",
        "arn:aws:s3:::campaign-app-uploads-xxxxx/*"
      ]
    }
  ]
}
EOF

aws iam put-user-policy \
  --user-name campaign-app-s3-user \
  --policy-name S3AccessPolicy \
  --policy-document file://s3-policy.json

# Create access keys
aws iam create-access-key --user-name campaign-app-s3-user
```

Save the `AccessKeyId` and `SecretAccessKey` for your environment variables.

### 3. Update Environment Variables

Add to your `.env` file:

```bash
FILE_STORAGE=s3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_S3_BUCKET=campaign-app-uploads-xxxxx
```

---

## Environment Variables

Complete list of environment variables for production:

```bash
# Application Settings
NODE_ENV=production
PORT=5000

# Database (AWS RDS)
DATABASE_URL=postgresql://postgres:password@campaign-db.xxxxx.us-east-1.rds.amazonaws.com:5432/campaigndb

# Security
DASHBOARD_PASSWORD=your-very-secure-password-here
ENCRYPTION_KEY=$(openssl rand -hex 32)
SESSION_SECRET=$(openssl rand -hex 32)

# CORS (your domain)
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# AWS S3 (if using S3 for file storage)
FILE_STORAGE=s3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_S3_BUCKET=campaign-app-uploads-xxxxx

# Optional: Email service
BREVO_API_KEY=your-brevo-api-key

# Optional: OpenAI
OPENAI_API_KEY=sk-...
```

---

## Deployment with ECS/Fargate

For a more scalable, managed deployment:

### 1. Push Docker Image to ECR

```bash
# Create ECR repository
aws ecr create-repository --repository-name campaign-app

# Get login command
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com

# Build and tag image
docker build -t campaign-app .
docker tag campaign-app:latest \
  <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/campaign-app:latest

# Push to ECR
docker push <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/campaign-app:latest
```

### 2. Create ECS Cluster

```bash
aws ecs create-cluster --cluster-name campaign-cluster
```

### 3. Create Task Definition

Create `task-definition.json`:

```json
{
  "family": "campaign-app",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "campaign-app",
      "image": "<AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/campaign-app:latest",
      "portMappings": [
        {
          "containerPort": 5000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {"name": "NODE_ENV", "value": "production"},
        {"name": "PORT", "value": "5000"}
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT_ID:secret:campaign/database-url"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/campaign-app",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:5000/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ]
}
```

Register the task definition:

```bash
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

### 4. Create ECS Service

```bash
aws ecs create-service \
  --cluster campaign-cluster \
  --service-name campaign-service \
  --task-definition campaign-app \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxxx,subnet-yyyyy],securityGroups=[sg-xxxxx],assignPublicIp=ENABLED}"
```

---

## Setting up Load Balancer

### 1. Create Application Load Balancer

```bash
# Create ALB
aws elbv2 create-load-balancer \
  --name campaign-alb \
  --subnets subnet-xxxxx subnet-yyyyy \
  --security-groups sg-xxxxx
```

### 2. Create Target Group

```bash
aws elbv2 create-target-group \
  --name campaign-targets \
  --protocol HTTP \
  --port 5000 \
  --vpc-id vpc-xxxxx \
  --health-check-path /health \
  --health-check-interval-seconds 30 \
  --health-check-timeout-seconds 5 \
  --healthy-threshold-count 2 \
  --unhealthy-threshold-count 3
```

### 3. Create Listener

```bash
aws elbv2 create-listener \
  --load-balancer-arn <ALB_ARN> \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=forward,TargetGroupArn=<TARGET_GROUP_ARN>
```

For HTTPS, you'll need to create a certificate in ACM first.

---

## Security Best Practices

1. **Use AWS Secrets Manager** for sensitive data:
   ```bash
   aws secretsmanager create-secret \
     --name campaign/database-url \
     --secret-string "postgresql://..."
   ```

2. **Enable encryption at rest** for RDS and S3

3. **Use VPC** and private subnets for RDS

4. **Enable CloudWatch logs** for monitoring

5. **Use IAM roles** instead of access keys when possible

6. **Enable AWS WAF** on your ALB for additional security

7. **Regular security updates**:
   ```bash
   # Update base image regularly
   docker pull node:20-alpine
   docker build --no-cache -t campaign-app .
   ```

---

## Monitoring and Logging

### CloudWatch Logs

```bash
# Create log group
aws logs create-log-group --log-group-name /aws/campaign-app

# View logs
aws logs tail /aws/campaign-app --follow
```

### CloudWatch Alarms

```bash
# Create alarm for high CPU
aws cloudwatch put-metric-alarm \
  --alarm-name campaign-high-cpu \
  --alarm-description "Alert when CPU exceeds 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --statistic Average \
  --period 300 \
  --evaluation-periods 2 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold
```

---

## Troubleshooting

### Application won't start

```bash
# Check Docker logs
docker logs campaign-app

# Check if port is accessible
netstat -tlnp | grep 5000

# Test database connection
docker exec campaign-app node -e "
  const { Pool } = require('pg');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  pool.query('SELECT NOW()', (err, res) => {
    console.log(err ? err.stack : res.rows[0]);
    pool.end();
  });
"
```

### Database connection issues

```bash
# Test from EC2 to RDS
psql -h campaign-db.xxxxx.us-east-1.rds.amazonaws.com -U postgres -d campaigndb

# Check security group rules
aws ec2 describe-security-groups --group-ids sg-xxxxx
```

### S3 upload issues

```bash
# Test S3 access
aws s3 ls s3://campaign-app-uploads-xxxxx

# Verify IAM permissions
aws iam simulate-principal-policy \
  --policy-source-arn arn:aws:iam::ACCOUNT_ID:user/campaign-app-s3-user \
  --action-names s3:PutObject s3:GetObject \
  --resource-arns arn:aws:s3:::campaign-app-uploads-xxxxx/*
```

### Health check failing

```bash
# Test health endpoint
curl http://localhost:5000/health
curl http://localhost:5000/api/health

# Check application logs
docker logs -f campaign-app
```

---

## Estimated Costs

| Service | Configuration | Monthly Cost (USD) |
|---------|--------------|-------------------|
| EC2 t3.small | 1 instance | $15 |
| RDS db.t3.micro | PostgreSQL | $15 |
| S3 | 10GB storage + requests | $0.25 |
| ALB | Standard | $16 |
| Data Transfer | 100GB | $9 |
| **Total** | | **~$55/month** |

Costs can be reduced by:
- Using Reserved Instances (up to 72% savings)
- Using Spot Instances for non-critical environments
- Implementing auto-scaling to scale down during low usage
- Using S3 Intelligent-Tiering for cost optimization

---

## Next Steps

1. Set up SSL/TLS with ACM (AWS Certificate Manager)
2. Configure auto-scaling for ECS or EC2
3. Implement backup strategy for RDS and S3
4. Set up CI/CD pipeline with GitHub Actions or AWS CodePipeline
5. Configure CloudWatch dashboards for monitoring

For questions or issues, refer to the AWS documentation or open an issue in the repository.
