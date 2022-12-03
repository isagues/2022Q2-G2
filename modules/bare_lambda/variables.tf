variable "function_name" {
    description = "Name associated to the lambda function"
    type = string
}

variable "role" {
  description = "The lambda VPC subnet ids"
    type = string 
}

variable "runtime" {
description = "Lambda runtime"
  type = string
  default = "nodejs16.x"
}

variable "subnet_ids" {
  description = "The lambda VPC subnet ids"
  type        = list(any)
}

variable "security_groups" {
  description = "Security Groups"
  type        = list(string)
}

variable "ssm_endpoint" {
  description = "ARN of SSM's enpoint"
  type        = string
}
