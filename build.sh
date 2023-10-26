#!/bin/bash

BRANCH_NAME="chatgpt"

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

# Try building the Docker containers
if docker compose build; then
    echo build successful, bring down the current containers and start new ones
    docker compose down -v
    docker compose up -d
fi
