terraform {
  required_version = "~> 1.3.0"

  backend "s3" {
    key     = "state"
    encrypt = true
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.23.0"
    }
  }
}