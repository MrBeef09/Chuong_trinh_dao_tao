#!/bin/bash

# Phenikaa University Management System Setup Script
echo "🏛️  Phenikaa University Management System Setup"
echo "=============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if MySQL is running
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL is not installed. Please install MySQL first."
    exit 1
fi

echo "✅ Node.js and MySQL are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "⚠️  Please update .env file with your MySQL credentials before continuing."
    echo "   Edit DATABASE_URL in .env file with your MySQL username, password, and database name."
    echo ""
    read -p "Press Enter after updating .env file to continue..."
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run db:generate

# Push database schema
echo "🗄️  Setting up database schema..."
npm run db:push

# Ask if user wants to seed sample data
echo ""
read -p "🌱 Would you like to seed the database with sample data? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌱 Seeding database with sample data..."
    npm run db:seed
    echo "✅ Sample data added successfully!"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "🚀 To start the development server, run:"
echo "   npm run dev"
echo ""
echo "📖 Then open http://localhost:3000 in your browser"
echo ""
echo "📚 For more information, check the README.md file"

