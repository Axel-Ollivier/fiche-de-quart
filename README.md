# Fiche de Quart

An interactive dashboard application to organize daily activities into time blocks (quarts).

## Features

- Visual timeline of your daily schedule
- Customizable time blocks with names, colors, and descriptions
- Settings saved in local storage for persistence
- Mobile-friendly responsive design
- Docker containerized for easy deployment

## Development

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser at http://localhost:5173/

### Building for Production

```
npm run build
```

The production-ready files will be generated in the `dist` directory.

## Docker Deployment

The application is containerized with Docker for easy deployment.

### Local Docker Deployment

1. Build and run with Docker Compose:
   ```
   docker-compose up -d
   ```

2. Access the application at http://localhost:8080

### Manual Docker Commands

Build the Docker image:
```
docker build -t fiche-de-quart .
```

Run the container:
```
docker run -d -p 8080:80 --name fiche-de-quart fiche-de-quart
```

## VPS Deployment

This project includes GitHub Actions CI/CD to automatically deploy to a VPS.

### Initial VPS Setup

1. Log in to your VPS
   
2. Copy the setup script to your VPS:
   ```
   scp deploy/setup-vps.sh user@your-vps-ip:/tmp/
   ```

3. Run the setup script on your VPS:
   ```
   ssh user@your-vps-ip "chmod +x /tmp/setup-vps.sh && sudo /tmp/setup-vps.sh"
   ```

4. Update the Nginx configuration with your domain name:
   ```
   ssh user@your-vps-ip "sudo nano /etc/nginx/sites-available/fiche-de-quart"
   ```

### Configure SSL (HTTPS)

1. Upload the SSL setup script:
   ```
   scp deploy/setup-ssl.sh user@your-vps-ip:/tmp/
   ```

2. Run the SSL setup script with your domain name:
   ```
   ssh user@your-vps-ip "chmod +x /tmp/setup-ssl.sh && sudo /tmp/setup-ssl.sh your-domain.com"
   ```

### Configure GitHub Actions Secrets

In your GitHub repository, go to Settings > Secrets and Variables > Actions, and add the following secrets:

- `VPS_HOST`: Your VPS IP address or domain name
- `VPS_USERNAME`: The SSH username for your VPS
- `VPS_SSH_KEY`: The private SSH key for authentication to your VPS

### Trigger Deployment

Push to the `main` branch or manually trigger the workflow in GitHub Actions.

## License

MIT License