provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      created-by = "terraform"
    }
  }
}