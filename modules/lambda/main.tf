resource "aws_lambda_function" "this" {
  filename = var.filename

  function_name    = var.function_name
  role             = var.role
  handler          = var.handler
  source_code_hash = filebase64sha256(var.filename)

  runtime = var.runtime

  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = var.security_groups
  }

  tags = var.tags
}

# LAMBDA INVOCATION PERMISSION
resource "aws_lambda_permission" "apigw_lambda" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = var.function_name
  principal     = "apigateway.amazonaws.com"

  # source_arn = "arn:aws:execute-api:${var.aws_region}:${var.aws_account_id}:${var.gateway_id}/*/${aws_api_gateway_method.this.http_method}${aws_api_gateway_resource.this.path}"
  source_arn = "${var.execution_arn}/*/*/*"
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
  authorization = "NONE"
}

# PATH /test - Definir la lambda
resource "aws_api_gateway_integration" "lambda_response" {
  rest_api_id             = var.gateway_id
  resource_id             = aws_api_gateway_resource.this.id
  http_method             = aws_api_gateway_method.this.http_method
  integration_http_method = "POST" //Lambdas solo pueden ser accedidas por POST
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.this.invoke_arn
}


# PATH /path 200 RESPONSE
resource "aws_api_gateway_method_response" "response" {
  rest_api_id = var.gateway_id
  resource_id = aws_api_gateway_resource.this.id
  http_method = aws_api_gateway_method.this.http_method
  status_code = var.status_code
}

# PATH /path - GET method - 200 RESPONSE INTEGRATION
resource "aws_api_gateway_integration_response" "lambda_response" {
  rest_api_id = var.gateway_id
  resource_id = aws_api_gateway_resource.this.id
  http_method = aws_api_gateway_method.this.http_method
  status_code = aws_api_gateway_method_response.response.status_code

  depends_on = [
    aws_api_gateway_integration.lambda_response
  ]
}