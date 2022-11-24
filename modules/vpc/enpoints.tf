data "aws_region" "current" {}

resource "aws_vpc_endpoint" "gateway" {
    for_each = { for endpoint in var.endpoint_services : endpoint.service => endpoint if endpoint.type == "Gateway" }

    vpc_id              = aws_vpc.this.id
    service_name        = "com.amazonaws.${data.aws_region.current.name}.${each.value.service}"
    route_table_ids     = aws_route_table.private[*].id
    vpc_endpoint_type   = each.value.type
}


resource "aws_vpc_endpoint" "interface" {
    for_each = { for endpoint in var.endpoint_services : endpoint.service => endpoint if endpoint.type == "Interface" }

    vpc_id              = aws_vpc.this.id
    service_name        = "com.amazonaws.${data.aws_region.current.name}.${each.value.service}"
    subnet_ids          = aws_subnet.private[*].id
    security_group_ids  = each.value.security_groups
    vpc_endpoint_type   = each.value.type
}

output "ssm_endpoint"{
    value = aws_vpc_endpoint.interface["ssm"].dns_entry[0].dns_name
}

resource "aws_ssm_parameter" "dns" {
    for_each = {for k, endpoint in aws_vpc_endpoint.interface: k => endpoint.dns_entry[0]}

    name  = "/endpoint/${each.key}/dns"
    type  = "String"
    value = each.value.dns_name
}