
module "api_gateway" {
  source = "./modules/api_gateway"

  aws_region             = data.aws_region.this.name
  cognito_user_pool_name = "authUserPool"

  lambda_hashes = [for lambda in module.lambda : lambda.lambda_rest_configuration_hash]
}

data "aws_iam_role" "this" {
  name = "LabRole"
}

# resource "aws_security_group" "lambda" {
#   name   = "lambda_sg"
#   vpc_id = module.vpc.vpc_id
#   tags = {
#     Name = "lambda_sg"
#   }
# }

# resource "aws_security_group_rule" "out" {
#   type              = "egress"
#   from_port         = 0
#   to_port           = 0
#   protocol          = "-1"
#   cidr_blocks       = ["0.0.0.0/0"]
#   security_group_id = aws_security_group.lambda.id
# }

# resource "aws_security_group_rule" "http_in" {
#   type              = "ingress"
#   from_port         = 80
#   to_port           = 80
#   protocol          = "tcp"
#   cidr_blocks       = ["0.0.0.0/0"]
#   security_group_id = aws_security_group.lambda.id
# }

# resource "aws_security_group_rule" "https_in" {
#   type              = "ingress"
#   from_port         = 443
#   to_port           = 443
#   protocol          = "tcp"
#   cidr_blocks       = ["0.0.0.0/0"]
#   security_group_id = aws_security_group.lambda.id
# }

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