module "alarm" {
  source = "terraform-aws-modules/cloudwatch/aws//modules/metric-alarm"

  alarm_name          = "lambda-duration-${local.lambdas["listar_busquedas"].function_name}"
  alarm_description   = "Lambda duration is too high"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 1
  threshold           = 10
  period              = 60
  unit                = "Milliseconds"

  namespace   = "AWS/Lambda"
  metric_name = "Duration"
  statistic   = "Maximum"

  dimensions = {
    FunctionName = local.lambdas["listar_busquedas"].function_name
  }

  alarm_actions = [aws_sns_topic.this["cloudwatch"].arn]
}