output "domain_name" {
  description = "The api gateway domain name"
  value       = join(".", [aws_api_gateway_rest_api.this.id, "execute-api", var.aws_region, "amazonaws.com"])
}

output "id" {
  description = "The api gateway id"
  value       = aws_api_gateway_rest_api.this.id
}

output "gateway_authoriser_id" {
  description = "The api gateway authorizer id"
  value       = aws_api_gateway_authorizer.api_authorizer.id
}

output "execution_arm" {
  value = aws_api_gateway_rest_api.this.execution_arn
}

output "resource_id" {
  description = "The api gateway resource_id"
  value       = aws_api_gateway_rest_api.this.root_resource_id
}

output "user_pool_id" {
  description = "user pool id"
  value       = aws_cognito_user_pool.pool.id
}

output "client_pool_id" {
  description = "client pool id"
  value       = aws_cognito_user_pool_client.client.id
}

