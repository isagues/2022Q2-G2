data "aws_region" "current" {}

resource "aws_vpc_endpoint" "this" {
    for_each = toset(var.endpoint_services)

    vpc_id       = aws_vpc.this.id
    service_name = "com.amazonaws.${data.aws_region.current.name}.${each.key}"
    route_table_ids = aws_route_table.private[*].id
}