# DigitalOcean App Platform Deployment

This directory contains Terraform configuration to deploy the Africa Payment Checkout Portal to DigitalOcean App Platform.

## Prerequisites

1. [Terraform](https://www.terraform.io/downloads.html) installed (v1.0+)
2. DigitalOcean account with API token
3. GitHub repository access configured in DigitalOcean

## Setup

1. Copy the example variables file:
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   ```

2. Edit `terraform.tfvars` with your actual values:
   - DigitalOcean API token
   - Paydunya credentials
   - Preferred region and instance size

3. Initialize Terraform:
   ```bash
   terraform init
   ```

## Deployment

1. Review the planned changes:
   ```bash
   terraform plan
   ```

2. Apply the configuration:
   ```bash
   terraform apply
   ```

3. After successful deployment, Terraform will output the app URL.

## Configuration Options

### Regions
Available regions: `nyc`, `sfo`, `ams`, `sgp`, `lon`, `fra`, `tor`, `blr`

### Instance Sizes
- `basic-xxs`: $5/month (512 MB RAM, 1 vCPU)
- `basic-xs`: $10/month (1 GB RAM, 1 vCPU)
- `basic-s`: $20/month (2 GB RAM, 2 vCPU)
- `basic-m`: $40/month (4 GB RAM, 2 vCPU)

## Managing the App

View app status:
```bash
terraform show
```

Update configuration:
```bash
# Edit terraform.tfvars or main.tf
terraform apply
```

Destroy the app:
```bash
terraform destroy
```

## Environment Variables

The following environment variables are configured automatically:
- `PORT`: 3000
- `PAYDUNYA_MASTER_KEY`: From terraform.tfvars (secret)
- `PAYDUNYA_PRIVATE_KEY`: From terraform.tfvars (secret)
- `PAYDUNYA_PUBLIC_KEY`: From terraform.tfvars (secret)
- `PAYDUNYA_TOKEN`: From terraform.tfvars (secret)
- `PAYDUNYA_MODE`: test or live
- `CURRENCY`: Default currency (XOF, GHS, etc.)

## GitHub Integration

The app is configured to automatically deploy when you push to the specified branch (default: main).

Make sure your DigitalOcean account has access to the GitHub repository:
https://github.com/tecafrik-git/africa-payment-checkout-portal

## Troubleshooting

If deployment fails:
1. Check that your DigitalOcean token is valid
2. Verify GitHub repository access in DigitalOcean settings
3. Review build logs in the DigitalOcean dashboard
4. Ensure all required environment variables are set

## Security Notes

- Never commit `terraform.tfvars` to version control
- Store sensitive values securely (use environment variables or secret management)
- Rotate API tokens and credentials regularly
