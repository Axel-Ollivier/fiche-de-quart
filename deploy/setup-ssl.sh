#!/bin/bash
set -e

# Check if a domain name was provided
if [ -z "$1" ]; then
  echo "Usage: $0 <domain-name>"
  exit 1
fi

DOMAIN=$1

# Install Certbot if not already installed
if ! [ -x "$(command -v certbot)" ]; then
  echo "Installing Certbot..."
  apt-get update
  apt-get install -y certbot python3-certbot-nginx
fi

# Obtain SSL certificate
echo "Obtaining SSL certificate for $DOMAIN..."
certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email your-email@example.com

echo "SSL setup complete!"
echo "Your site should now be accessible via HTTPS at https://$DOMAIN"
echo
echo "Certbot has configured a cronjob to auto-renew your certificate before it expires."