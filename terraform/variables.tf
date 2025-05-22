variable "project_name" {
  type        = string
  description = "the name of the project"
  default     = "eas-notifier"
}

variable "env" {
  type        = string
  description = "The environment to deploy to"
}

variable "zone_id" {
  type        = string
  description = "The zone id for the route53 record"
}

variable "root_domain" {
  type        = string
  description = "The root domain for the route53 record"
  default     = "lhowsam.com"
}

variable "sub_domain" {
  type        = string
  description = "The sub domain for the route53 record"
}

variable "private_key" {
  type        = string
  description = "The private key for the certificate"
}

variable "certificate_body" {
  type        = string
  description = "The certificate body for the certificate"
}

variable "certificate_chain" {
  type        = string
  description = "The certificate chain for the certificate"
}

variable "deployed_by" {
  type        = string
  description = "The user who deployed the lambda"
}

variable "tags" {
  type        = map(string)
  description = "The tags to apply to the resources"
  default = {
    "Service"   = "eas-notifier"
    "ManagedBy" = "Terraform"
  }
}

variable "git_sha" {
  type        = string
  description = "The git sha of the commit that caused the deploy"
  default     = "unknown"
}

variable "api_key" {
  description = "API key for securing the API Gateway endpoints"
  type        = string
  sensitive   = true
}

variable "slack_webhook_url" {
  type        = string
  sensitive   = true
  description = "The webhook URL to send messages to"
}
