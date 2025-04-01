#!/bin/bash
set -e

# Update the system
echo "Updating system packages..."
apt-get update
apt-get upgrade -y

# Install Docker if not already installed
if ! [ -x "$(command -v docker)" ]; then
  echo "Installing Docker..."
  apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
  echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
  apt-get update
  apt-get install -y docker-ce docker-ce-cli containerd.io
fi

# Set up Nginx as a reverse proxy (if needed)
if ! [ -x "$(command -v nginx)" ]; then
  echo "Installing Nginx..."
  apt-get install -y nginx
fi

# Create Nginx configuration file for the app
cat > /etc/nginx/sites-available/fiche-de-quart << 'EOL'
server {
    listen 80;
    server_name your-domain.com;  # Replace with your actual domain name

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOL

# Enable the site
ln -sf /etc/nginx/sites-available/fiche-de-quart /etc/nginx/sites-enabled/

# Test Nginx configuration
nginx -t

# Reload Nginx
systemctl reload nginx

echo "VPS setup complete!"
echo "IMPORTANT: Configure the following GitHub secrets:"
echo "VPS_HOST: Your VPS IP address or hostname"
echo "VPS_USERNAME: Your SSH username"
echo "VPS_SSH_KEY: Your private SSH key for authentication"
echo
echo "Don't forget to update the server_name in /etc/nginx/sites-available/fiche-de-quart"
echo "with your actual domain name!"