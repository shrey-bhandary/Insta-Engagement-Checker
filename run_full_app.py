import subprocess
import threading
import time
import webbrowser
from pathlib import Path

def run_backend():
    """Run the Flask backend server"""
    print("🚀 Starting Flask backend server...")
    subprocess.run(["python", "backend_api.py"])

def run_frontend():
    """Run the React frontend development server"""
    print("🎨 Starting React frontend server...")
    frontend_path = Path("frontend")
    subprocess.run(["npm", "run", "dev"], cwd=frontend_path)

def main():
    print("🔥 Starting Instagram Engagement Checker...")
    print("=" * 50)
    
    # Start backend in a separate thread
    backend_thread = threading.Thread(target=run_backend, daemon=True)
    backend_thread.start()
    
    # Wait a moment for backend to start
    time.sleep(3)
    
    # Start frontend in main thread
    try:
        run_frontend()
    except KeyboardInterrupt:
        print("\n👋 Shutting down servers...")

if __name__ == "__main__":
    main()