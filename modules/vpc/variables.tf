# Input variable definitions

variable "cidr_block" {
  description = "CIDR blocknof the VPC."
  type        = string
  default     = "10.0.0.0/16"
}

variable "zones_count" {
  description = "Number of zones."
  type        = number
  default     = 2
}

variable "endpoint_services" {
  description = "VPC enpoints."
  type = list(object({service: string, type: string, security_groups: list(string)}))
}
