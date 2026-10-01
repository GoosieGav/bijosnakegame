#!/usr/bin/env python3
"""
Installation and setup script for Bijo Snake Game
"""

import subprocess
import sys
import os

def install_requirements():
    """Install required packages"""
    try:
        print("Installing pygame...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ pygame installed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing pygame: {e}")
        return False

def check_images():
    """Check if Bijo images exist"""
    required_images = ['bijo_forward.png', 'bijo_left.png', 'bijo_right.png']
    missing_images = []
    
    for image in required_images:
        if not os.path.exists(image):
            missing_images.append(image)
    
    if missing_images:
        print(f"⚠️  Warning: Missing image files: {', '.join(missing_images)}")
        print("The game will use colored rectangles instead of Bijo sprites.")
        return False
    else:
        print("✅ All Bijo images found!")
        return True

def main():
    print("🎮 Bijo Snake Game Setup")
    print("=" * 30)
    
    # Check for images
    images_ok = check_images()
    
    # Install requirements
    if install_requirements():
        print("\n🚀 Starting Bijo Snake Game...")
        print("Controls:")
        print("- Arrow keys: Move Bijo")
        print("- P: Pause/Resume")
        print("- SPACE: Restart after game over")
        print("- Close window: Quit")
        print("\nEnjoy playing with Bijo! 🥟")
        
        # Run the game
        try:
            import bijo_snake_game
        except ImportError as e:
            print(f"❌ Error running game: {e}")
            print("Try running: python bijo_snake_game.py")
    else:
        print("❌ Setup failed. Please install pygame manually:")
        print("pip install pygame")

if __name__ == "__main__":
    main()




