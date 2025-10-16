terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }
}

provider "digitalocean" {
  token = var.do_token
}

resource "digitalocean_app" "africa_payment_portal" {
  spec {
    name   = "africa-payment-checkout-portal"
    region = var.region

    dynamic "domain" {
      for_each = var.domain != "" ? [1] : []
      content {
        name = var.domain
      }
    }

    service {
      name               = "payment-portal"
      instance_count     = 1
      instance_size_slug = var.instance_size

      github {
        repo           = "tecafrik-git/africa-payment-checkout-portal"
        branch         = var.branch
        deploy_on_push = true
      }

      build_command = "npm install && npm run build"
      run_command   = "npm start"

      http_port = 3000

      env {
        key   = "PORT"
        value = "3000"
        scope = "RUN_TIME"
      }

      env {
        key   = "PAYDUNYA_MASTER_KEY"
        value = var.paydunya_master_key
        scope = "RUN_TIME"
        type  = "SECRET"
      }

      env {
        key   = "PAYDUNYA_PRIVATE_KEY"
        value = var.paydunya_private_key
        scope = "RUN_TIME"
        type  = "SECRET"
      }

      env {
        key   = "PAYDUNYA_PUBLIC_KEY"
        value = var.paydunya_public_key
        scope = "RUN_TIME"
        type  = "SECRET"
      }

      env {
        key   = "PAYDUNYA_TOKEN"
        value = var.paydunya_token
        scope = "RUN_TIME"
        type  = "SECRET"
      }

      env {
        key   = "PAYDUNYA_MODE"
        value = var.paydunya_mode
        scope = "RUN_TIME"
      }

      env {
        key   = "CURRENCY"
        value = var.currency
        scope = "RUN_TIME"
      }

      health_check {
        http_path = "/payment?amount=1&productName=health"
      }
    }
  }
}
