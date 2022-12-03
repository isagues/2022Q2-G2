module "static_site" {
  source = "./modules/static_site"

  src               = local.static_resources
  bucket_access_OAI = [module.cdn.static_site_OAIs_arn]
  constants = {
    USER_POOL_ID : module.api_gateway.user_pool_id,
    CLIENT_ID : module.api_gateway.client_pool_id,
    BASE_URL : local.app_domain
  }
}

