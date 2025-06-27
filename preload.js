const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Recording detection methods
  getDetectionStatus: () => ipcRenderer.invoke('get-detection-status'),
  toggleDetection: (enable) => ipcRenderer.invoke('toggle-detection', enable),
  checkRecordingNow: () => ipcRenderer.invoke('check-recording-now'),
  
  // Security logging
  logSecurityEvent: (eventData) => ipcRenderer.invoke('log-security-event', eventData),
  
  // Listen for recording detection events
  onRecordingDetected: (callback) => {
    ipcRenderer.on('recording-detected', callback);
  },
  
  // Remove listeners
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  },
  
  // App info
  getAppVersion: () => process.versions.electron,
  getPlatform: () => process.platform,
  
  // Window controls (if needed)
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window')
});

// Also expose a simpler interface for backward compatibility
contextBridge.exposeInMainWorld('recordingDetection', {
  isActive: () => ipcRenderer.invoke('get-detection-status'),
  start: () => ipcRenderer.invoke('toggle-detection', true),
  stop: () => ipcRenderer.invoke('toggle-detection', false),
  check: () => ipcRenderer.invoke('check-recording-now'),
  onDetected: (callback) => ipcRenderer.on('recording-detected', callback)
});

// Console logging for debugging (remove in production)
console.log('Preload script loaded successfully');
console.log('Platform:', process.platform);
console.log('Electron version:', process.versions.electron);