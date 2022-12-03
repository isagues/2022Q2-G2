resource "aws_sns_topic" "this" {
  for_each = toset(local.sns)

  name_prefix = each.key
}

resource "aws_ssm_parameter" "this" {
  for_each = toset(local.sns)

  name  = "/sns/${each.key}/topicARN"
  type  = "String"
  value = aws_sns_topic.this[each.key].arn
}