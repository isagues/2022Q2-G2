
module "api_gateway" {
  source = "./modules/api_gateway"

  aws_region = var.aws_region
  cognito_user_pool_name = "authUserPool"

  lambda_hashes =  [for lambda in module.lambda : lambda.lambda_rest_configuration_hash]
#   module.lambda[*].lambda_rest_configuration_hash
  #[ module.getPresignedURL_lambda.lambda_rest_configuration_hash, 
    # module.lambda_listar_busquedas.lambda_rest_configuration_hash, 
    # module.lambda_crear_busqueda.lambda_rest_configuration_hash,
    # module.lambda_ver_busqueda.lambda_rest_configuration_hash,
    # module.lambda_ver_aplicaciones.lambda_rest_configuration_hash,]
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


locals {
  lambdas = {
    test = {
      function_name = "test"
      path_part     = "test"
      http_method   = "GET"
      status_code   = "200"
      auth          = true
    }
    listar_busquedas = {
      function_name = "listar_busquedas"
      path_part     = "listar_busquedas"
      http_method   = "GET"
      status_code   = "200"
      auth          = true
    }
    ver_aplicaciones = {
      function_name = "ver_aplicaciones"
      path_part     = "ver_aplicaciones"
      http_method   = "GET"
      status_code   = "200"
      auth          = true
    }
    crear_busqueda = {
      function_name = "crear_busqueda"
      path_part     = "crear_busqueda"
      http_method   = "POST"
      status_code   = "200"
      auth          = true
    }
    ver_busqueda = {
      function_name = "ver_busqueda"
      path_part     = "ver_busqueda"
      http_method   = "GET"
      status_code   = "200"
      auth          = true
    }
    getPresignedURL = {
      function_name = "getPresignedURL"
      path_part     = "getPresignedURL"
      http_method   = "POST"
      status_code   = "200"
      auth          = false
    }
  }
}

module "lambda" {
  for_each = local.lambdas

  source = "./modules/lambda"

  function_name = each.value.function_name

  ssm_endpoint   = module.vpc.ssm_endpoint 

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
  security_groups = [aws_security_group.lambda.id]
}