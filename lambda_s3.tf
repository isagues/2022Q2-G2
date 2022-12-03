module "handleCVUpload" {
  source = "./modules/bare_lambda"
  
  function_name   = "handleNewCV"
  subnet_ids      = module.vpc.private_subnets_ids
  role            = data.aws_iam_role.this.arn
  security_groups = [aws_security_group.lambda.id]
  ssm_endpoint    = module.vpc.ssm_endpoint 
}

resource "aws_lambda_permission" "allow_bucket" {
  statement_id  = "AllowExecutionFromS3Bucket"
  action        = "lambda:InvokeFunction"
  function_name = module.handleCVUpload.arn
  principal     = "s3.amazonaws.com"
  source_arn    = module.cvs.s3_bucket_arn
}

resource "aws_s3_bucket_notification" "bucket_notification" {
  bucket = module.cvs.s3_bucket_id

  lambda_function {
    lambda_function_arn = module.handleCVUpload.arn
    events              = ["s3:ObjectCreated:*"]
  }

  depends_on = [aws_lambda_permission.allow_bucket]
}