data "terraform_remote_state" "vpc" {
  backend   = "s3"
  workspace = var.env
  config = {
    bucket         = "eas-notifier-${var.env}-terraform-state"
    key            = "vpc/${var.env}.tfstate"
    region         = "eu-west-2"
    dynamodb_table = "eas-notifier-${var.env}-terraform-state-lock"
    encrypt        = true
  }
}
