locals {
  aws_account_id = data.aws_caller_identity.this.account_id

  # Frontend
  static_resources = "frontend"

  # AWS VPC Configuration
  aws_vpc_network = "10.0.0.0/16"
  aws_az_count    = 2

  app_domain = var.base_domain

  s3_origin_id  = "static-site"
  api_origin_id = "api-gateway"

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

  security_groups = {
    lambda = {
      name = "lambda_sg",
      rules = [{
        name        = "no-egress"
        type        = "egress"
        from_port   = 0
        to_port     = 0
        protocol    = "-1"
        cidr_blocks = ["0.0.0.0/0"]
        },
        {
          name        = "ingress-http"
          type        = "ingress"
          from_port   = 80
          to_port     = 80
          protocol    = "tcp"
          cidr_blocks = ["0.0.0.0/0"]
        },
        {
          name        = "ingress-https"
          type        = "ingress"
          from_port   = 443
          to_port     = 443
          protocol    = "tcp"
          cidr_blocks = ["0.0.0.0/0"]
        }
      ]
    }
  }

  flatten_sg_rules = flatten([
    for key, value in local.security_groups : [
      for rule in value.rules : {
        sg_name = key
        rule    = rule
      }
  ]])

  sns = [
    "cloudwatch", "applications"
  ]
}