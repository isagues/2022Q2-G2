module "job_searchs_table" {
  source = "terraform-aws-modules/dynamodb-table/aws"

  name     = "job-searchs"
  hash_key = "id"
  range_key = "application"

  attributes = [
    {
      name = "id"
      type = "S"
    },
    {
      name = "application"
      type = "S"
    },
    {
      name = "username"
      type = "S"
    }
  ]
  
  global_secondary_indexes = [
    {
      name               = "user-index"
      hash_key           = "username"
      projection_type    = "ALL"
    }
  ]
}