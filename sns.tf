resource "aws_sns_topic" "cloudwatch" {
  name_prefix = "cloudwatch-notifications"
}
resource "aws_sns_topic" "new_users" {
  name_prefix = "new-users-notifications"
}

resource "aws_ssm_parameter" "new_users" {
  name  = "/sns/new_users/topicARN"
  type  = "String"
  value = aws_sns_topic.new_users.arn
}