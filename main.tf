terraform {
  required_version = "~> 1.3.0"

  backend "s3" {
    key     = "state"
    encrypt = true
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.23.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

locals {
  app_domain = var.base_domain

  s3_origin_id  = "static-site"
  api_origin_id = "api-gateway"
}

module "certificate" {
  source = "./modules/certificate"

  base_domain = var.base_domain
  app_domain  = local.app_domain
}

resource "aws_cloudfront_origin_access_identity" "cdn" {
  comment = local.s3_origin_id
}

module "static_site" {
  source = "./modules/static_site"

  src               = local.static_resources
  bucket_access_OAI = [aws_cloudfront_origin_access_identity.cdn.iam_arn]
  constants =  {
    USER_POOL_ID: module.api_gateway.user_pool_id,
    CLIENT_ID: module.api_gateway.client_pool_id,
    BASE_URL: local.app_domain 
  }
}

module "cdn" {
  source = "./modules/cdn"

  OAI                = aws_cloudfront_origin_access_identity.cdn
  s3_origin_id       = local.s3_origin_id
  bucket_domain_name = module.static_site.domain_name
  api_origin_id      = local.api_origin_id
  api_domain_name    = module.api_gateway.domain_name
  aliases            = ["www.${local.app_domain}", local.app_domain]
  certificate_arn    = module.certificate.arn
  waf_arn            = aws_wafv2_web_acl.this.arn
}

module "dns" {
  source = "./modules/dns"

  base_domain = var.base_domain
  app_domain  = local.app_domain
  cdn         = module.cdn.cloudfront_distribution
}

module "vpc" {
  source = "./modules/vpc"

  cidr_block  = local.aws_vpc_network
  zones_count = local.aws_az_count
  endpoint_services =  [
    {service: "dynamodb", type: "Gateway", security_groups: []}, 
    {service: "s3", type: "Gateway", security_groups: []}, 
    {service: "sns", type: "Interface", security_groups: [aws_security_group.lambda.id]}, 
    {service: "ssm", type: "Interface", security_groups: [aws_security_group.lambda.id]}, 
  ]
}

module "api_gateway" {
  source = "./modules/api_gateway"

  aws_region = var.aws_region
  cognito_user_pool_name = "authUserPool"


  lambda_hashes = [
    module.getPresignedURL_lambda.lambda_rest_configuration_hash, 
    module.lambda.lambda_rest_configuration_hash, 
    module.lambda_busquedas.lambda_rest_configuration_hash, 
    module.sns_lambda.lambda_rest_configuration_hash, 
    module.lambda_crear_busqueda.lambda_rest_configuration_hash,
    ]

}

data "aws_iam_role" "this" {
  name = "LabRole"
}


resource "aws_security_group" "lambda" {
  name   = "lambda_sg"
  vpc_id = module.vpc.vpc_id
  tags = {
    Name = "lambda_sg"
  }
}

resource "aws_security_group_rule" "out" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.lambda.id
}

resource "aws_security_group_rule" "http_in" {
  type              = "ingress"
  from_port         = 80
  to_port           = 80
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.lambda.id
}

resource "aws_security_group_rule" "https_in" {
  type              = "ingress"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.lambda.id
}



module "getPresignedURL_lambda" {
  source = "./modules/lambda"

  function_name = "getPresignedURL"
  filename      = "./lambda/getPresignedURL.zip"
  handler       = "getPresignedURL.handler"
  runtime       = "nodejs12.x"

  base_domain    = var.base_domain
  aws_account_id = local.aws_account_id
  aws_region     = var.aws_region
  ssm_endpoint   = module.vpc.ssm_endpoint 

  gateway_id          = module.api_gateway.id
  gateway_authoriser_id = module.api_gateway.gateway_authoriser_id
  gateway_resource_id = module.api_gateway.resource_id
  execution_arn       = module.api_gateway.execution_arm

  path_part   = "getPresignedURL"
  http_method = "POST"
  status_code = "200"

  subnet_ids      = module.vpc.private_subnets_ids
  vpc_id          = module.vpc.vpc_id
  role            = data.aws_iam_role.this.arn
  security_groups = [aws_security_group.lambda.id]
  tags = {
    Name = "Test Lambda"
  }
}

module "lambda" {
  source = "./modules/lambda"

  function_name = "test"
  filename      = "./lambda/test.zip"
  handler       = "test.handler"
  runtime       = "nodejs12.x"

  base_domain    = var.base_domain
  aws_account_id = local.aws_account_id
  aws_region     = var.aws_region
  ssm_endpoint   = module.vpc.ssm_endpoint 

  gateway_id          = module.api_gateway.id
  gateway_authoriser_id = module.api_gateway.gateway_authoriser_id
  gateway_resource_id = module.api_gateway.resource_id
  execution_arn       = module.api_gateway.execution_arm

  path_part   = "test"
  http_method = "GET"
  status_code = "200"

  subnet_ids      = module.vpc.private_subnets_ids
  vpc_id          = module.vpc.vpc_id
  role            = data.aws_iam_role.this.arn
  security_groups = [aws_security_group.lambda.id]
  tags = {
    Name = "Test Lambda"
  }
}

module "lambda_busquedas" {
  source = "./modules/lambda"

  function_name = "listar_busquedas"
  filename      = "./lambda/listar_busquedas.zip"
  handler       = "listar_busquedas.handler"
  runtime       = "nodejs12.x"

  base_domain    = var.base_domain
  aws_account_id = local.aws_account_id
  aws_region     = var.aws_region
  ssm_endpoint   = module.vpc.ssm_endpoint 

  gateway_id          = module.api_gateway.id
  gateway_authoriser_id = module.api_gateway.gateway_authoriser_id
  gateway_resource_id = module.api_gateway.resource_id
  execution_arn       = module.api_gateway.execution_arm

  path_part   = "listar_busquedas"
  http_method = "GET"
  status_code = "200"

  subnet_ids      = module.vpc.private_subnets_ids
  vpc_id          = module.vpc.vpc_id
  role            = data.aws_iam_role.this.arn
  security_groups = [aws_security_group.lambda.id]
  tags = {
    Name = "ListarBusquedas Lambda"
  }
}

module "sns_lambda" {
  source = "./modules/lambda"

  function_name = "sns"
  filename      = "./lambda/sns.zip"
  handler       = "sns.handler"
  runtime       = "nodejs12.x"

  base_domain    = var.base_domain
  aws_account_id = local.aws_account_id
  aws_region     = var.aws_region
  ssm_endpoint   = module.vpc.ssm_endpoint 

  gateway_id          = module.api_gateway.id
  gateway_authoriser_id = module.api_gateway.gateway_authoriser_id
  gateway_resource_id = module.api_gateway.resource_id
  execution_arn       = module.api_gateway.execution_arm

  path_part   = "sns"
  http_method = "GET"
  status_code = "200"

  subnet_ids      = module.vpc.private_subnets_ids
  vpc_id          = module.vpc.vpc_id
  role            = data.aws_iam_role.this.arn
  security_groups = [aws_security_group.lambda.id]
  tags = {
    Name = "sns test"
  }
}

module "lambda_crear_busqueda" {
  source = "./modules/lambda"

  function_name = "crear_busqueda"
  filename      = "./lambda/crear_busqueda.zip"
  handler       = "crear_busqueda.handler"
  runtime       = "nodejs12.x"

  base_domain    = var.base_domain
  aws_account_id = local.aws_account_id
  aws_region     = var.aws_region
  ssm_endpoint   = module.vpc.ssm_endpoint 

  gateway_id          = module.api_gateway.id
  gateway_authoriser_id = module.api_gateway.gateway_authoriser_id
  gateway_resource_id = module.api_gateway.resource_id
  execution_arn       = module.api_gateway.execution_arm

  path_part   = "crear_busqueda"
  http_method = "POST"
  status_code = "200"

  subnet_ids      = module.vpc.private_subnets_ids
  vpc_id          = module.vpc.vpc_id
  role            = data.aws_iam_role.this.arn
  security_groups = [aws_security_group.lambda.id]
  tags = {
    Name = "CrearBusqueda Lambda"
  }
}

module "job_searchs_table" {
  source = "terraform-aws-modules/dynamodb-table/aws"

  name     = "job-searchs"
  hash_key = "id"

  attributes = [
    {
      name = "id"
      type = "N"
    }
    , {
      name = "description"
      type = "S"
    }
  ]

  global_secondary_indexes = [{
    name               = "DescriptionIndex"
    hash_key           = "description"
    write_capacity     = 10
    read_capacity      = 10
    projection_type    = "INCLUDE"
    non_key_attributes = ["id"]
  }]
}

  module "applications_table" {
  source = "terraform-aws-modules/dynamodb-table/aws"

  name     = "applications"
  hash_key = "id"

  attributes = [
    {
      name = "id"
      type = "N"
    }
    , {
      name = "search_id"
      type = "N"
    }
    , {
      name = "cv_link"
      type = "S"
    }
  ]

  global_secondary_indexes = [{
    name               = "SearchIdIndex"
    hash_key           = "search_id"
    write_capacity     = 10
    read_capacity      = 10
    projection_type    = "INCLUDE"
    non_key_attributes = ["id", "cv_link"]
  },
  {
    name               = "CvLinkIndex"
    hash_key           = "cv_link"
    write_capacity     = 10
    read_capacity      = 10
    projection_type    = "INCLUDE"
    non_key_attributes = ["id", "search_id"]
  }
  ]
  
}