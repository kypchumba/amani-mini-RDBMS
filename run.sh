#!/bin/bash
# run.sh - start Chama Dashboard


echo "Starting Chama Dashboard..."

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    echo "Activating virtual environment..."
    source venv/bin/activate
fi

# Install requirements if not installed
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Set Flask app and run
export FLASK_APP=app.py
export FLASK_ENV=development
echo "Launching Flask..."
flask run

# End message
echo " Chama Dashboard is running at http://127.0.0.1:5000"
