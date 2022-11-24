resource "aws_sns_topic" "cloudwatch" {
  name_prefix = "cloudwatch-notifications"
}
resource "aws_sns_topic" "new_users" {
  name_prefix = "new-users-notifications"
}
