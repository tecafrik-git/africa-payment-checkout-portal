variable "do_token" {
  description = "DigitalOcean API token"
  type        = string
  sensitive   = true
}

variable "region" {
  description = "DigitalOcean region for the app"
  type        = string
  default     = "nyc"
}

variable "branch" {
  description = "GitHub branch to deploy"
  type        = string
  default     = "main"
}

variable "instance_size" {
  description = "App Platform instance size"
  type        = string
  default     = "basic-xxs"
}

variable "paydunya_master_key" {
  description = "Paydunya Master Key"
  type        = string
  sensitive   = true
}

variable "paydunya_private_key" {
  description = "Paydunya Private Key"
  type        = string
  sensitive   = true
}

variable "paydunya_public_key" {
  description = "Paydunya Public Key"
  type        = string
  sensitive   = true
}

variable "paydunya_token" {
  description = "Paydunya Token"
  type        = string
  sensitive   = true
}

variable "paydunya_mode" {
  description = "Paydunya mode (test or live)"
  type        = string
  default     = "test"
}

variable "currency" {
  description = "Default currency"
  type        = string
  default     = "XOF"
}
