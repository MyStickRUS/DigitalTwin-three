#!/bin/bash

BRANCH_NAME="main"
DOMAIN="twinexample.ru"
EMAIL="md_studio@mail.ru"

if ! git diff-index --quiet HEAD --; then
    echo "Your working directory is not clean. Please commit or stash your changes."
    exit 1
fi

git checkout "$BRANCH_NAME"
if [ $? -ne 0 ]; then
    echo "Error switching to branch $BRANCH_NAME"
    exit 1
fi

git pull origin "$BRANCH_NAME"
if [ $? -ne 0 ]; then
    echo "Error pulling branch $BRANCH_NAME"
    exit 1
fi

# Create dummy certificate to start nginx
if [ ! -f "certbot/conf/live/$DOMAIN/fullchain.pem" ]; then
    echo "### Creating dummy certificate for $DOMAIN ..."
    mkdir -p "certbot/conf/live/$DOMAIN"
    docker-compose run --rm --entrypoint "\
        openssl req -x509 -nodes -newkey rsa:4096 -days 1\
        -keyout '/etc/letsencrypt/live/$DOMAIN/privkey.pem' \
        -out '/etc/letsencrypt/live/$DOMAIN/fullchain.pem' \
        -subj '/CN=localhost'" certbot
    echo
fi

# Try building the Docker containers
if docker-compose build; then
    echo "Build successful, starting services..."
    docker-compose up -d server

    # Request Let's Encrypt certificate
    echo "### Requesting Let's Encrypt certificate for $DOMAIN ..."
    
    # Select appropriate email arg
    case "$EMAIL" in
      "") email_arg="--register-unsafely-without-email" ;;
      *) email_arg="--email $EMAIL" ;;
    esac

    docker-compose run --rm --entrypoint "\
      certbot certonly --webroot -w /var/www/certbot \
        $email_arg \
        -d $DOMAIN \
        --rsa-key-size 4096 \
        --agree-tos \
        --force-renewal" certbot

    echo "### Reloading nginx ..."
    docker-compose exec server nginx -s reload
    
    docker-compose down -v
    docker-compose up -d
    docker image prune --filter label=stage=builder --force
fi
