locals {
  private_cidr = cidrsubnet(aws_vpc.this.cidr_block, 1, 1)
}