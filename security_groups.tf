resource "aws_security_group" "this" {
  for_each = local.security_groups

  name   = each.value.name
  vpc_id = module.vpc.vpc_id
}

resource "aws_security_group_rule" "this" {
  for_each = {
    for sg_rule in local.flatten_sg_rules : "${sg_rule.sg_name}#${sg_rule.rule.name}" => sg_rule
  }

  type              = each.value.rule.type
  from_port         = each.value.rule.from_port
  to_port           = each.value.rule.to_port
  protocol          = each.value.rule.protocol
  cidr_blocks       = each.value.rule.cidr_blocks
  security_group_id = aws_security_group.this[each.value.sg_name].id
}
