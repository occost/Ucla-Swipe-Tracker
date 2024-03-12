#!/bin/bash

# Stop on the first sign of trouble
set -e

echo "Installing dependencies..."
npm install

echo "Installing additional packages..."
npm install next router react-firebase-hooks firebase

echo "Starting the development server..."
npm run dev