const { spawn } = require('child_process');
const path = require('path');

// Alternative tunnel startup script that doesn't require global ngrok installation
async function startWithAlternativeTunnel() {
  console.log('🚀 Starting Expo with alternative tunnel solution...');
  
  try {
    // First, try to start expo normally
    const expoProcess = spawn('npx', ['expo', 'start', '--localhost'], {
      cwd: path.join(__dirname),
      stdio: 'inherit',
      shell: true
    });

    expoProcess.on('error', (error) => {
      console.error('❌ Error starting Expo:', error);
    });

    expoProcess.on('close', (code) => {
      console.log(`Expo process exited with code ${code}`);
    });

    // Provide instructions for manual connection
    console.log('\n📱 Connection Instructions:');
    console.log('1. Open Expo Go app on your iPhone');
    console.log('2. Tap "Enter URL manually"');
    console.log('3. Enter: exp://127.0.0.1:8081');
    console.log('4. If that doesn\'t work, try the QR code method');
    
  } catch (error) {
    console.error('❌ Failed to start alternative tunnel:', error);
  }
}

startWithAlternativeTunnel();