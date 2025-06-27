# Student Management System - Desktop Application

## 🚀 Features

- **🔒 Screen Recording Detection**: Automatically detects and blocks access when screen recording software is running
- **👨‍🎓 Student Portal**: Complete student management with Supabase integration
- **🔐 Admin Portal**: Administrative controls and user management
- **📱 Cross-Platform**: Built with Electron for Windows, macOS, and Linux
- **🛡️ Security Logging**: All security events are logged to Supabase and locally

## 📋 Prerequisites

- Node.js 16 or later
- Windows 10 or later (for Windows builds)
- Internet connection for Supabase integration

## 🛠️ Quick Start

### Option 1: Download Pre-built Executable (Recommended)

1. Go to the [Releases](../../releases) page
2. Download the latest `.exe` file
3. Run as Administrator (required for screen detection)
4. Follow the installation wizard

### Option 2: Build from Source

```bash
# Clone the repository
git clone <your-repo-url>
cd student-management-system

# Install dependencies
npm install

# Run in development mode
npm start

# Build for Windows
npm run build:win
```

## 🔧 Configuration

### Supabase Setup

The application connects to Supabase using the configuration in the HTML files:

- **Project URL**: `https://lfszceyrzwsyxlvubrcc.supabase.co`
- **Public Key**: Already configured in the application
- **Database Tables**: Ensure all required tables exist (see YOUWARE.md)

### Screen Recording Detection

The app automatically detects these recording applications:
- OBS Studio
- Bandicam
- Camtasia
- Fraps
- NVIDIA GeForce Experience
- XSplit
- Action! Screen Recorder
- Movavi Screen Recorder
- Snagit
- Loom
- Zoom (when screen sharing)

## 🏗️ GitHub Actions Auto-Build

This repository includes GitHub Actions that automatically build the Windows executable:

### Setup Instructions:

1. **Create GitHub Repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/student-management-system.git
   git push -u origin main
   ```

2. **Enable GitHub Actions**:
   - Go to your repository on GitHub
   - Click on the "Actions" tab
   - The workflow will automatically run on every push to main branch

3. **Download Built Executable**:
   - After the workflow completes, go to the "Actions" tab
   - Click on the latest workflow run
   - Download the "student-management-system-windows" artifact
   - Extract and run the `.exe` file

### Manual Trigger:
You can also trigger builds manually:
1. Go to Actions tab
2. Select "Build Electron App" workflow
3. Click "Run workflow"

## 📁 Project Structure

```
├── main.js                 # Electron main process
├── preload.js             # Preload script for security
├── package.json           # Dependencies and build config
├── renderer/              # Web application files
│   ├── index.html         # Portal selector
│   ├── 0cj1zfmo29.html   # Student portal
│   ├── 47gwy2ga4a.html   # Admin portal
│   └── 44drn7nkwr.html   # Password reset
├── assets/                # Application assets
├── .github/workflows/     # GitHub Actions
└── dist/                  # Built executables (created during build)
```

## 🔒 Security Features

### Recording Detection
- Monitors running processes every 3 seconds
- Blocks access to sensitive content when recording software is detected
- Shows warning dialogs to users
- Logs all detection events

### Security Event Logging
- All security events are logged to Supabase database
- Local backup logging via Electron Store
- Includes timestamp, user ID, and event details

### Administrative Controls
- Requires administrator privileges for process monitoring
- Prevents external navigation and new window creation
- Secure communication between main and renderer processes

## 🎯 Usage

1. **Launch Application**: Run as Administrator
2. **Select Portal**: Choose Student or Admin portal
3. **Authentication**: Login with Supabase credentials
4. **Security Monitoring**: App automatically monitors for recording software
5. **Content Access**: Access is granted/denied based on security status

## 🐛 Troubleshooting

### Common Issues:

**"Screen Recording Detection: Inactive"**
- Ensure the app is running as Administrator
- Check if Node.js dependencies are properly installed

**Build Failures on GitHub Actions**
- Verify package.json syntax is correct
- Check if all dependencies are available
- Ensure the repository has proper access permissions

**App won't start**
- Try running from command line to see error messages
- Ensure all HTML files are in the renderer/ directory
- Check if Supabase credentials are correctly configured

## 📝 Development

### Local Development:
```bash
npm start           # Run in development mode
npm run pack        # Package without building installer
npm run build       # Build full installer
```

### Debug Mode:
The application includes console logging for debugging. Open Developer Tools (Ctrl+Shift+I) to view logs.

## 📜 License

MIT License - see package.json for details

## 🆘 Support

For issues and support:
- Check the troubleshooting section above
- Review console logs for error details
- Verify Supabase connection and table structure

---

**Version**: 1.0.0 (Electron Desktop)  
**Built with**: Electron, Node.js, Supabase  
**Security**: Screen Recording Detection Enabled