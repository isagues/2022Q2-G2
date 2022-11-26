variable "function_name" {
    type = string
}

variable "role" {
    type = string 
}

variable "runtime" {
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
  type        = string
}
