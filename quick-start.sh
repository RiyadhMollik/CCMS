#!/bin/bash

# CCMS Quick Start Script
# This script will help you get started quickly

echo "========================================="
echo "CCMS Maximum Temperature Data System"
echo "Quick Start Guide"
echo "========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "index.js" ]; then
    echo "❌ Error: Please run this script from the CCMS root directory"
    exit 1
fi

echo "📦 Step 1: Installing backend dependencies..."
npm install sequelize mysql2 dotenv --save

echo ""
echo "📝 Step 2: Setting up environment file..."
if [ ! -f ".env" ]; then
    cat > .env << EOF
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=ccms_db
EOF
    echo "✅ Created .env file (please update with your MySQL credentials)"
else
    echo "ℹ️  .env file already exists"
fi

echo ""
echo "🗄️  Step 3: Database setup instructions..."
echo "Please run the following SQL command in your MySQL:"
echo "   CREATE DATABASE IF NOT EXISTS ccms_db;"
echo ""
read -p "Press Enter after creating the database..."

echo ""
echo "🚀 Step 4: Starting the server..."
echo "The server will auto-create tables on first run."
echo ""

node index.js
