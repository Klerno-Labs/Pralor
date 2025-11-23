import os
import shutil
import datetime

# PRALOR DEEP CLEAN PROTOCOL
# ==========================
# This script reorganizes a messy project into a professional architecture.
# It moves 'archive' folders to a backup location and structures the 'src' folder.

ROOT_DIR = os.getcwd()
BACKUP_DIR = os.path.join(ROOT_DIR, "_ARCHIVED_PROJECTS")
SRC_DIR = os.path.join(ROOT_DIR, "src")

# 1. Define the Ideal Structure
NEW_STRUCTURE = {
    "src/services": [],      # For API calls (Firebase, Gemini)
    "src/components": [],    # For React Components
    "src/context": [],       # For Auth/Global State
    "src/styles": [],        # For CSS
    "src/assets": [],        # For Images/SVGs
    "public": []             # For static public files
}

def log(msg):
    print(f"[SYSTEM] {msg}")

def safe_move(src, dest):
    """Moves a file or folder safely, creating directories if needed."""
    if not os.path.exists(src):
        return
    
    # Create destination directory if it doesn't exist
    dest_dir = os.path.dirname(dest)
    if not os.path.exists(dest_dir):
        os.makedirs(dest_dir)
        
    try:
        shutil.move(src, dest)
        log(f"Moved: {os.path.basename(src)} -> {dest}")
    except Exception as e:
        print(f"[ERROR] Could not move {src}: {e}")

def run_cleanup():
    log("Initiating PRALOR Deep Clean Protocol...")
    
    # --- STEP 1: Quarantine Old Projects ---
    if os.path.exists(os.path.join(ROOT_DIR, "archive")):
        log("Detected 'archive' folder. Moving to separate backup directory...")
        safe_move(os.path.join(ROOT_DIR, "archive"), os.path.join(BACKUP_DIR, "legacy_code"))
    
    # Also look for other clutter often found in root
    clutter = [".DS_Store", "thumbs.db", "yarn-error.log"]
    for item in clutter:
        if os.path.exists(item):
            os.remove(item)

    # --- STEP 2: Create Standard Directories ---
    for folder in NEW_STRUCTURE:
        os.makedirs(os.path.join(ROOT_DIR, folder), exist_ok=True)

    # --- STEP 3: Organize Source Code (Refactoring) ---
    
    # 3a. Move API/Logic to Services
    # Move 'ai' folder contents to 'services'
    if os.path.exists(os.path.join(SRC_DIR, "ai")):
        for file in os.listdir(os.path.join(SRC_DIR, "ai")):
            safe_move(os.path.join(SRC_DIR, "ai", file), os.path.join(SRC_DIR, "services", file))
        os.rmdir(os.path.join(SRC_DIR, "ai")) # Remove empty folder

    # Move 'firebase' folder contents to 'services'
    if os.path.exists(os.path.join(SRC_DIR, "firebase")):
        for file in os.listdir(os.path.join(SRC_DIR, "firebase")):
            safe_move(os.path.join(SRC_DIR, "firebase", file), os.path.join(SRC_DIR, "services", file))
        os.rmdir(os.path.join(SRC_DIR, "firebase"))

    # 3b. Move Styles
    if os.path.exists(os.path.join(SRC_DIR, "index.css")):
        safe_move(os.path.join(SRC_DIR, "index.css"), os.path.join(SRC_DIR, "styles", "index.css"))

    # 3c. Update Imports (Basic String Replacement)
    # Since we moved files, we need to fix imports in App.jsx, main.jsx, and components.
    # This is a simplified patcher.
    
    log("Patching import paths for new structure...")
    
    files_to_patch = []
    for root, dirs, files in os.walk(SRC_DIR):
        for file in files:
            if file.endswith(".jsx") or file.endswith(".js"):
                files_to_patch.append(os.path.join(root, file))

    replacements = {
        "from './ai/gemini'": "from '../services/gemini'",
        "from '../ai/gemini'": "from '../services/gemini'",
        "from './firebase/auth'": "from '../services/auth'",
        "from '../firebase/auth'": "from '../services/auth'",
        "from './firebase/config'": "from '../services/config'",
        "from '../firebase/config'": "from '../services/config'",
        "from './index.css'": "from './styles/index.css'",
        "from '../index.css'": "from '../styles/index.css'",
    }

    for file_path in files_to_patch:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            for old, new in replacements.items():
                content = content.replace(old, new)
            
            # Special case for main.jsx importing css
            if "main.jsx" in file_path:
                content = content.replace("import './index.css'", "import './styles/index.css'")

            # Special case for components importing services (they are now siblings or parents)
            # If a component was "import {x} from '../firebase/auth'", it is now "import {x} from '../services/auth'"
            
            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                log(f"Patched imports in: {os.path.basename(file_path)}")
        except Exception as e:
            print(f"Skipped patching {file_path}: {e}")

    print("\n-------------------------------------------------------")
    print("   CLEANUP COMPLETE")
    print("-------------------------------------------------------")
    print("1. Your old projects are safely in: /_ARCHIVED_PROJECTS")
    print("2. Your main app is now organized in: /src")
    print("3. Logic is in /src/services")
    print("4. Styling is in /src/styles")
    print("-------------------------------------------------------")
    print("NEXT STEP: Run 'npm run dev' to ensure everything links up.")

if __name__ == "__main__":
    run_cleanup()