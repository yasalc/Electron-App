const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const ps = require('ps-node');
const Store = require('electron-store');
const axios = require('axios');

// Initialize electron store for app settings
const store = new Store();

// Keep a global reference of the window object
let mainWindow;
let detectionInterval;
let isDetectionActive = false;

// List of known screen recording software process names
const RECORDING_SOFTWARE = [
  'obs64.exe', 'obs32.exe', 'obs.exe',
  'bandicam.exe', 'bdcam.exe',
  'camtasia.exe', 'camtasiastudio.exe',
  'screenrec.exe', 'screenrecorder.exe',
  'fraps.exe',
  'nvidia-share.exe', // NVIDIA GeForce Experience
  'xsplit.broadcaster.exe', 'xsplit.gamecaster.exe',
  'action.exe', // Action! Screen Recorder
  'movavi-screen-recorder.exe',
  'snagit32.exe', 'snagiteditor.exe',
  'loom.exe',
  'zoom.exe' // Zoom screen sharing
];

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets', 'icon.png'),
    show: false,
    titleBarStyle: 'default'
  });

  // Load the main portal selector
  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // Start recording detection after window is ready
    startRecordingDetection();
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    stopRecordingDetection();
    mainWindow = null;
  });

  // Prevent external navigation
  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    
    if (parsedUrl.origin !== 'file://') {
      event.preventDefault();
      shell.openExternal(navigationUrl);
    }
  });

  // Handle new window requests
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// Screen recording detection function
function detectRecordingSoftware() {
  return new Promise((resolve) => {
    ps.lookup({}, (err, processes) => {
      if (err) {
        console.error('Error detecting processes:', err);
        resolve({ detected: false, processes: [] });
        return;
      }

      const detectedRecording = processes.filter(process => {
        if (!process || !process.command) return false;
        
        const processName = path.basename(process.command).toLowerCase();
        return RECORDING_SOFTWARE.some(recordingSoft => 
          processName.includes(recordingSoft.toLowerCase().replace('.exe', ''))
        );
      });

      if (detectedRecording.length > 0) {
        console.log('Recording software detected:', detectedRecording.map(p => p.command));
        resolve({ 
          detected: true, 
          processes: detectedRecording.map(p => ({
            name: path.basename(p.command),
            pid: p.pid,
            command: p.command
          }))
        });
      } else {
        resolve({ detected: false, processes: [] });
      }
    });
  });
}

// Start recording detection with interval
function startRecordingDetection() {
  if (isDetectionActive) return;
  
  isDetectionActive = true;
  console.log('Starting screen recording detection...');
  
  // Check immediately
  checkForRecording();
  
  // Then check every 3 seconds
  detectionInterval = setInterval(checkForRecording, 3000);
}

// Stop recording detection
function stopRecordingDetection() {
  if (detectionInterval) {
    clearInterval(detectionInterval);
    detectionInterval = null;
  }
  isDetectionActive = false;
  console.log('Stopped screen recording detection');
}

// Check for recording and handle detection
async function checkForRecording() {
  try {
    const result = await detectRecordingSoftware();
    
    if (result.detected && mainWindow && !mainWindow.isDestroyed()) {
      // Send detection event to renderer process
      mainWindow.webContents.send('recording-detected', {
        detected: true,
        processes: result.processes,
        timestamp: new Date().toISOString()
      });
      
      // Log to console
      console.log('SECURITY ALERT: Screen recording detected!', result.processes);
      
      // Show warning dialog
      showRecordingDetectedDialog(result.processes);
    }
  } catch (error) {
    console.error('Error in recording detection:', error);
  }
}

// Show recording detected dialog
function showRecordingDetectedDialog(processes) {
  const processNames = processes.map(p => p.name).join(', ');
  
  dialog.showMessageBox(mainWindow, {
    type: 'warning',
    title: 'Security Alert',
    message: 'Screen Recording Detected',
    detail: `The following recording software has been detected: ${processNames}\n\nThis activity has been logged and reported to the administrator.\n\nPlease close all recording software to continue using this application.`,
    buttons: ['OK', 'Exit Application'],
    defaultId: 0,
    cancelId: 0
  }).then((result) => {
    if (result.response === 1) {
      // User chose to exit
      app.quit();
    }
  });
}

// IPC handlers
ipcMain.handle('get-detection-status', () => {
  return isDetectionActive;
});

ipcMain.handle('toggle-detection', (event, enable) => {
  if (enable && !isDetectionActive) {
    startRecordingDetection();
  } else if (!enable && isDetectionActive) {
    stopRecordingDetection();
  }
  return isDetectionActive;
});

ipcMain.handle('check-recording-now', async () => {
  return await detectRecordingSoftware();
});

ipcMain.handle('log-security-event', async (event, eventData) => {
  // Log security events to Supabase (can be called from renderer)
  console.log('Security event logged:', eventData);
  
  try {
    // This would integrate with your Supabase logging
    // For now, just log to console and store locally
    const events = store.get('securityEvents', []);
    events.push({
      ...eventData,
      timestamp: new Date().toISOString(),
      appVersion: app.getVersion()
    });
    store.set('securityEvents', events);
    
    return { success: true };
  } catch (error) {
    console.error('Error logging security event:', error);
    return { success: false, error: error.message };
  }
});

// App event handlers
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  stopRecordingDetection();
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  stopRecordingDetection();
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });
});