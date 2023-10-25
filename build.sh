#!/bin/bash

# Store current running containers' information
previous_containers=$(docker ps --format "{{.Names}}")

# Try building the Docker containers
if docker compose build; then
    echo build successful, bring down the current containers and start new ones
    docker compose down -v
    docker compose up -d
else
    # If build failed, invoke the bash script from the environment variable
    if [ -n "$FAILURE_SCRIPT_PATH" ] && [ -x "$FAILURE_SCRIPT_PATH" ]; then
        "$FAILURE_SCRIPT_PATH" "Test"
    else
        echo "Build failed, but no valid failure script found to run."
    fi
    
    # If you want to restart the old container after the failure script:
    for container in $previous_containers; do
        docker start "$container"
    done
fi
