resource "aws_dynamodb_table" "dynamodb_terraform_lock" {
  name         = "eas-notifier-${var.env}-terraform-state-lock"
  hash_key     = "LockID"
  billing_mode = "PAY_PER_REQUEST"
  attribute {
    name = "LockID"
    type = "S"
  }

  tags = merge(var.tags, {
    Name = "eas-notifier-${var.env}-terraform-state-lock"
  })
}
