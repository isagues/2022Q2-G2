# Output variable definitions

output "bucket" {
  description = "Bucket"
  value       = module.s3.s3_bucket_id
}

output "region" {
  description = "State storage region"
  value       = var.aws_region
}
