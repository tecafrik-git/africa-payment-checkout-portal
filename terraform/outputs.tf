output "app_url" {
  description = "The live URL of the deployed app"
  value       = digitalocean_app.africa_payment_portal.live_url
}

output "app_id" {
  description = "The ID of the DigitalOcean App"
  value       = digitalocean_app.africa_payment_portal.id
}

output "default_ingress" {
  description = "The default ingress URL"
  value       = digitalocean_app.africa_payment_portal.default_ingress
}
