
module "api_gateway" {
  source = "./modules/api_gateway"

  aws_region             = data.aws_region.this.name
  cognito_user_pool_name = "authUserPool"

  lambda_hashes = [for lambda in module.lambda : lambda.lambda_rest_configuration_hash]
}

data "aws_iam_role" "this" {
  name = "LabRole"
}
module "lambda" {
  for_each = local.lambdas

  source = "./modules/api_gw_lambda"

  function_name = each.value.function_name

  ssm_endpoint = module.vpc.ssm_endpoint

  gateway_id            = module.api_gateway.id
  gateway_authorizer_id = each.value.auth ? module.api_gateway.gateway_authorizer_id : "NONE"
  gateway_resource_id   = module.api_gateway.resource_id
  execution_arn         = module.api_gateway.execution_arm

  path_part   = each.value.path_part
  http_method = each.value.http_method
  status_code = each.value.status_code

  subnet_ids      = module.vpc.private_subnets_ids
  vpc_id          = module.vpc.vpc_id
  role            = data.aws_iam_role.this.arn
  security_groups = [aws_security_group.this["lambda"].id]
}