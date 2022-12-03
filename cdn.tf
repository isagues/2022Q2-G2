module "cdn" {
  source = "./modules/cdn"

  # OAI                = aws_cloudfront_origin_access_identity.this
  # s3_origin_id       = local.s3_origin_id
  bucket_domain_name = module.static_site.domain_name
  # api_origin_id      = local.api_origin_id
  api_domain_name    = module.api_gateway.domain_name
  aliases            = ["www.${local.app_domain}", local.app_domain]
  certificate_arn    = module.certificate.arn
  waf_arn            = aws_wafv2_web_acl.this.arn
}