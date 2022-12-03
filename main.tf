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
