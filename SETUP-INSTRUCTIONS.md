# 🚀 Complete Setup Instructions

## Step 1: Create GitHub Repository

1. **Go to GitHub.com and create a new repository**:
   - Repository name: `student-management-system` (or your preferred name)
   - Set to Public or Private (your choice)
   - ✅ Add a README file
   - ✅ Add .gitignore (choose Node)
   - Choose a license (MIT recommended)

2. **Clone your new repository**:
   ```bash
   git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
   cd YOUR-REPO-NAME
   ```

## Step 2: Upload the Electron Application Files

1. **Copy all files from this project** to your cloned repository folder:
   - `package.json`
   - `main.js`
   - `preload.js`
   - `renderer/` folder (with all HTML files)
   - `.github/workflows/` folder
   - `assets/` folder
   - `README-ELECTRON.md`

2. **Commit and push to GitHub**:
   ```bash
   git add .
   git commit -m "Add Electron desktop application with screen recording detection"
   git push origin main
   ```

## Step 3: Automatic Build Process

**The GitHub Actions workflow will automatically start** when you push the code:

1. **Monitor the build**:
   - Go to your repository on GitHub
   - Click the "Actions" tab
   - You'll see "Build Electron App" workflow running
   - Wait for it to complete (usually 5-10 minutes)

2. **Download the executable**:
   - Click on the completed workflow run
   - Scroll down to "Artifacts" section
   - Download "student-management-system-windows"
   - Extract the ZIP file to get your `.exe` application

## Step 4: Install and Run

1. **Extract the downloaded ZIP file**
2. **Right-click the `.exe` file → "Run as administrator"**
   - ⚠️ Administrator privileges are required for screen recording detection
3. **Follow the installation wizard** (if it's an installer)
4. **Launch the application**

## Step 5: Testing

1. **Test the application**:
   - Portal selector should appear
   - Student portal should work with your Supabase backend
   - Admin portal should be accessible

2. **Test screen recording detection**:
   - Open OBS Studio or any screen recording software
   - Launch your app
   - Try to access video content in the student portal
   - You should see security warnings

## 🔧 Customization Options

### Change Detection Settings
Edit `main.js` to modify:
- Detection interval (currently 3 seconds)
- List of recording software to detect
- Security response behavior

### Modify UI
Edit files in `renderer/` folder:
- Update colors, fonts, layout
- Add your own branding
- Modify the portal selector

### Add More Security Features
Extend the detection system:
- Monitor clipboard access
- Detect virtual machines
- Add watermarking to videos
- Implement session recording

## 🚨 Important Security Notes

1. **Administrator Privileges**: Required for process monitoring
2. **Antivirus Software**: May flag the app as suspicious due to process monitoring
3. **Firewall**: Ensure the app can access Supabase (internet connection required)
4. **Student Instructions**: Provide clear installation instructions to students

## 🔄 Update Process

To update the application:

1. **Modify your source files**
2. **Commit and push changes**:
   ```bash
   git add .
   git commit -m "Update application features"
   git push origin main
   ```
3. **GitHub Actions will automatically build a new version**
4. **Download the new executable from the Actions tab**

## 📱 Distribution to Students

### Option 1: Direct Download
- Share the GitHub repository link
- Students download from Releases page
- Provide installation instructions

### Option 2: Direct File Sharing
- Download the built executable
- Share via Google Drive, OneDrive, etc.
- Include installation guide

### Sample Student Instructions:
```
🎓 Student Management System - Installation Guide

1. Download the attached .exe file
2. Right-click → "Run as administrator"
3. Follow the installation wizard
4. Launch the application
5. Select "Student Portal"
6. Login with your credentials

⚠️ Important: This app monitors for screen recording software to protect course content.
```

## 🛠️ Troubleshooting

### Build Fails on GitHub Actions
- Check package.json syntax
- Verify all files are committed
- Ensure repository permissions are correct

### App Doesn't Start
- Run as Administrator
- Check if all dependencies installed correctly
- Review error messages in console

### Detection Not Working
- Verify app has administrator privileges
- Check if target recording software is in the detection list
- Review console logs for error messages

### Supabase Connection Issues
- Verify project URL and API keys
- Check internet connection
- Ensure database tables exist

## 📞 Next Steps

After successful setup:

1. **Test thoroughly** with different recording software
2. **Distribute to a small group** of students first
3. **Gather feedback** and iterate
4. **Roll out to all students** once stable
5. **Monitor security logs** in your Supabase dashboard

---

**Need Help?** Check the console logs and error messages for specific debugging information.