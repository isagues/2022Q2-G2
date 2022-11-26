module "lambda" {
  source = "../bare_lambda"
  
  function_name   = var.function_name
  subnet_ids      = var.subnet_ids
  role            = var.role
  security_groups = var.security_groups
  ssm_endpoint    = var.ssm_endpoint
}


# LAMBDA INVOCATION PERMISSION
resource "aws_lambda_permission" "apigw_lambda" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = var.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${var.execution_arn}/*/${aws_api_gateway_method.this.http_method}${aws_api_gateway_resource.this.path}"
  
  depends_on = [
    module.lambda
  ]
}

# /path
resource "aws_api_gateway_resource" "this" {
  path_part   = var.path_part
  parent_id   = var.gateway_resource_id
  rest_api_id = var.gateway_id
}

# PATH /path - define method
resource "aws_api_gateway_method" "this" {
  rest_api_id   = var.gateway_id
  resource_id   = aws_api_gateway_resource.this.id
  http_method   = var.http_method
  authorization = var.gateway_authorizer_id == "NONE" ? "NONE" : "COGNITO_USER_POOLS"
  authorizer_id = var.gateway_authorizer_id == "NONE" ? "" : var.gateway_authorizer_id
}

# PATH /test - Definir la lambda
resource "aws_api_gateway_integration" "this" {
  rest_api_id             = var.gateway_id
  resource_id             = aws_api_gateway_resource.this.id
  http_method             = aws_api_gateway_method.this.http_method
  integration_http_method = "POST" //Lambdas solo pueden ser accedidas por POST
  type                    = "AWS_PROXY"
  uri                     = module.lambda.invoke_arn
}


# PATH /path 200 RESPONSE
resource "aws_api_gateway_method_response" "this" {
  rest_api_id = var.gateway_id
  resource_id = aws_api_gateway_resource.this.id
  http_method = aws_api_gateway_method.this.http_method
  status_code = var.status_code
}

# PATH /path - GET method - 200 RESPONSE INTEGRATION
resource "aws_api_gateway_integration_response" "this" {
  rest_api_id = var.gateway_id
  resource_id = aws_api_gateway_resource.this.id
  http_method = aws_api_gateway_method.this.http_method
  status_code = aws_api_gateway_method_response.this.status_code

  depends_on = [
    aws_api_gateway_integration.this
  ]
}