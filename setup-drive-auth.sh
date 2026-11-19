#!/bin/bash

# STUDEX Google Drive Authentication Setup
# Enables agent + Claude access to business folders

set -e

echo "🔐 STUDEX Google Drive Authentication Setup"
echo "==========================================="
echo ""

# Step 1: Create GCP Project (if needed)
echo "Step 1: GCP Project Setup"
echo "------------------------"
echo "Go to: https://console.cloud.google.com"
echo "1. Create new project: 'STUDEX-Platform'"
echo "2. Enable APIs:"
echo "   - Google Drive API"
echo "   - Google Sheets API"
echo "   - Google Docs API"
echo "3. Create Service Account:"
echo "   - Service Account Name: 'studex-agents'"
echo "   - Role: 'Editor'"
echo "4. Download JSON key → save to: ~/.studex/gcp-sa-key.json"
echo ""
read -p "Press ENTER when GCP setup complete..."

# Step 2: Set Environment Variables
echo ""
echo "Step 2: Set Environment Variables"
echo "--------------------------------"
GCP_KEY_PATH="$HOME/.studex/gcp-sa-key.json"

if [ ! -f "$GCP_KEY_PATH" ]; then
    echo "❌ GCP key not found at: $GCP_KEY_PATH"
    echo "Please download it from GCP Console"
    exit 1
fi

export GOOGLE_APPLICATION_CREDENTIALS="$GCP_KEY_PATH"
echo "✅ GOOGLE_APPLICATION_CREDENTIALS set"

# Step 3: Authenticate with gcloud
echo ""
echo "Step 3: gcloud Authentication"
echo "----------------------------"
gcloud auth application-default login
echo "✅ gcloud authenticated"

# Step 4: Create Shared Drive Folder
echo ""
echo "Step 4: Create STUDEX Shared Folder"
echo "---------------------------------"
echo "Go to: https://drive.google.com"
echo "1. Create folder: 'STUDEX-Platform'"
echo "2. Share with service account:"
echo "   Email: $(cat $GCP_KEY_PATH | grep client_email | cut -d'"' -f4)"
echo "3. Grant 'Editor' access"
echo "4. Get Folder ID from URL: drive.google.com/drive/folders/[FOLDER_ID]"
echo ""
read -p "Enter Folder ID: " FOLDER_ID

# Step 5: Store Configuration
echo ""
echo "Step 5: Save Configuration"
echo "------------------------"
mkdir -p ~/.studex
cat > ~/.studex/studex-config.env << EOF
# STUDEX Platform Configuration
export GOOGLE_APPLICATION_CREDENTIALS="$GCP_KEY_PATH"
export GCP_PROJECT_ID=$(cat $GCP_KEY_PATH | grep project_id | cut -d'"' -f4)
export STUDEX_DRIVE_FOLDER_ID="$FOLDER_ID"
export STUDEX_SERVICE_ACCOUNT=$(cat $GCP_KEY_PATH | grep client_email | cut -d'"' -f4)
EOF

echo "✅ Configuration saved to: ~/.studex/studex-config.env"

# Step 6: Test Access
echo ""
echo "Step 6: Test Drive Access"
echo "------------------------"
source ~/.studex/studex-config.env

gcloud drive files list --folder-id "$FOLDER_ID" 2>/dev/null && {
    echo "✅ Drive access verified!"
} || {
    echo "⚠️  Drive access test failed - check permissions"
}

# Step 7: Share Folder with Claude Code
echo ""
echo "Step 7: Share Folder with Claude Code"
echo "------------------------------------"
echo "Go to: https://drive.google.com/drive/folders/$FOLDER_ID"
echo "1. Share folder with this email: t.ramaphosa@studex.dev"
echo "2. Grant 'Viewer' access"
echo "3. This enables Claude to read your business files"
echo ""

# Step 8: Final Setup
echo ""
echo "✅ STUDEX Google Drive Authentication Complete!"
echo ""
echo "Next steps:"
echo "1. Upload your business files to: https://drive.google.com/drive/folders/$FOLDER_ID"
echo "2. Run: source ~/.studex/studex-config.env"
echo "3. Start Day 1 deployment"
echo ""
echo "Service Account Email: $(cat $GCP_KEY_PATH | grep client_email | cut -d'"' -f4)"
echo "Drive Folder ID: $FOLDER_ID"
echo ""
