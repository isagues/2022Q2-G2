variable "function_name" {
  description = "The lambda executable filename"
  type        = string
}

variable "vpc_id" {
  description = "The lambda VPC id"
  type        = string
}

variable "subnet_ids" {
  description = "The lambda VPC subnet ids"
  type        = list(any)
}

variable "role" {
  description = "IAM Role"
  type        = string
}

variable "security_groups" {
  description = "Security Groups"
  type        = list(string)
}

variable "ssm_endpoint" {
  description = "ARN of SSM's enpoint"
  type        = string
}

variable "gateway_id" {
  description = "The api gateway id"
  type        = string
}

variable "gateway_authorizer_id" {
  description = "The api gateway authorizer id"
  type        = string
  default     = "NONE"
}

variable "gateway_resource_id" {
  description = "The api gateway resource id"
  type        = string
}

variable "execution_arn" {
  description = "API Gateway's execution ARN"
  type        = string
}

variable "path_part" {
  description = "The path to call lambda"
  type        = string
}

variable "http_method" {
  description = "The http method to call lambda"
  type        = string
}

variable "status_code" {
  description = "The http method to call lambda"
  type        = string
}