#!/bin/bash

# Check if a commit message was provided
if [ -z "$1" ]; then
  echo "Error: Please provide a commit message."
  echo "Usage: ./sync.sh \"Your commit message\""
  exit 1
fi

echo "Adding all changes..."
git add .

echo "Committing changes..."
git commit -m "$1"

echo "Pushing to remote..."
# Try to push, if it fails, it might be because remote is not set
if git push; then
  echo "Successfully pushed to GitHub!"
else
  echo "Push failed. Please make sure you have set the remote origin."
  echo "Run: git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
fi
