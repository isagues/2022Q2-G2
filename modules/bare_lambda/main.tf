
data "archive_file" "this" {
  type        = "zip"
  source_file = local.file_name
  output_path = local.zipe_file_name
}

resource "aws_lambda_function" "this" {
  filename = local.zipe_file_name

  function_name    = var.function_name
  role             = var.role
  handler          = local.handler
  source_code_hash = filebase64sha256(local.zipe_file_name)

  runtime = var.runtime

  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = var.security_groups
  }

  environment {
    variables = {
      ssm_endpoint = var.ssm_endpoint
    }
  }

  depends_on = [
    data.archive_file.this
  ]
}