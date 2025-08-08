#!/bin/bash

# Activate virtual environment
source venv/bin/activate

# Install required packages if not already installed
pip install -r requirements.txt

# Run the Streamlit app
streamlit run app.py
