module "vpc" {
  source = "./modules/vpc"

  cidr_block  = local.aws_vpc_network
  zones_count = local.aws_az_count
  endpoint_services = [
    { service : "dynamodb", type : "Gateway", security_groups : [] },
    { service : "s3", type : "Gateway", security_groups : [] },
    { service : "sns", type : "Interface", security_groups : [aws_security_group.this["lambda"].id] },
    { service : "ssm", type : "Interface", security_groups : [aws_security_group.this["lambda"].id] },
  ]
}
