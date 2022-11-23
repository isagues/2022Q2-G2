resource "aws_sns_topic" "cloudwatch" {
  name_prefix = "cloudwatch-notifications"
}
