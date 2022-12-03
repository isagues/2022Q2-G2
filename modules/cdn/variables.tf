# Input variable definitions
# variable "OAI" {
#   description = "OAI of the distribution"
#   type        = map(any)
# }

# variable "s3_origin_id" {
#   description = "origin id to be used with static site"
#   type = string
# }

# variable "api_origin_id" {
#     description = "origin id to be used with API"

#   type = string
# }

variable "api_domain_name" {
  description = "target domain name of the API"
  type = string
}

variable "bucket_domain_name" {
  description = "target domain name of the S3 bucket"
  type = string
}

variable "aliases" {
  description = "Aliases for the distribution"
  type = set(string)
  default = []
}

variable "certificate_arn" {
  description = "ARN of the certificate associated with domain name"
  type = string
}

variable "waf_arn" {
  description = "ARN of global WAF"
  type = string
}