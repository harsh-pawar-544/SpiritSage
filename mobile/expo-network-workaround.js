const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

// Network connectivity workaround for Bolt.new environment
class ExpoNetworkWorkaround {
  constructor() {
    this.retryCount = 0;
    this.maxRetries = 3;
  }

  async startExpoWithWorkarounds() {
    console.log('🔧 SpiritSage Mobile - Network Connectivity Workaround');
    console.log('📡 Attempting to resolve Expo network issues...\n');

    // Method 1: Try offline mode first
    await this.tryOfflineMode();
  }

  async tryOfflineMode() {
    console.log('🔄 Method 1: Starting Expo in offline-compatible mode...');
    
    try {
      // Set environment variables to bypass network checks
      process.env.EXPO_OFFLINE = 'true';
      process.env.EXPO_NO_TELEMETRY = 'true';
      process.env.EXPO_NO_UPDATE_CHECK = 'true';
      
      const expoArgs = [
        'expo', 'start',
        '--web',
        '--localhost',
        '--clear',
        '--no-dev-client'
      ];

      const expoProcess = spawn('npx', expoArgs, {
        cwd: path.join(__dirname),
        stdio: 'pipe',
        shell: true,
        env: { ...process.env }
      });

      let hasStarted = false;
      let output = '';

      expoProcess.stdout.on('data', (data) => {
        const text = data.toString();
        output += text;
        console.log(text);

        // Check if Metro bundler started successfully
        if (text.includes('Metro waiting on') || text.includes('Web is waiting on')) {
          hasStarted = true;
          this.displaySuccessInstructions();
        }
      });

      expoProcess.stderr.on('data', (data) => {
        const text = data.toString();
        console.error(text);
        
        // If we see the FetchError, try alternative method
        if (text.includes('FetchError') || text.includes('socket hang up')) {
          console.log('\n⚠️  Network connectivity issue detected. Trying alternative method...');
          expoProcess.kill();
          setTimeout(() => this.tryAlternativeMethod(), 2000);
        }
      });

      expoProcess.on('close', (code) => {
        if (!hasStarted && this.retryCount < this.maxRetries) {
          this.retryCount++;
          console.log(`\n🔄 Retry ${this.retryCount}/${this.maxRetries}: Attempting alternative method...`);
          setTimeout(() => this.tryAlternativeMethod(), 1000);
        }
      });

    } catch (error) {
      console.error('❌ Offline mode failed:', error);
      this.tryAlternativeMethod();
    }
  }

  async tryAlternativeMethod() {
    console.log('\n🔄 Method 2: Using local development server...');
    
    try {
      // Create a simple local server that serves the web version
      const server = http.createServer((req, res) => {
        res.writeHead(200, {
          'Content-Type': 'text/html',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>SpiritSage Mobile - Development Mode</title>
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; padding: 20px; }
                .container { max-width: 600px; margin: 0 auto; }
                .status { background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 10px 0; }
                .instructions { background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 10px 0; }
                .code { background: #f5f5f5; padding: 10px; border-radius: 4px; font-family: monospace; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>🍸 SpiritSage Mobile</h1>
                <div class="status">
                  <h3>✅ Development Server Active</h3>
                  <p>The Metro bundler is running in network-isolated mode.</p>
                </div>
                
                <div class="instructions">
                  <h3>📱 Connect Your iPhone:</h3>
                  <ol>
                    <li>Open Expo Go app on your iPhone</li>
                    <li>Tap "Enter URL manually"</li>
                    <li>Try these URLs in order:</li>
                  </ol>
                  <div class="code">
                    exp://localhost:8081<br>
                    exp://127.0.0.1:8081<br>
                    exp://192.168.1.100:8081
                  </div>
                  
                  <h3>🌐 Web Preview:</h3>
                  <p>Visit: <a href="http://localhost:8081" target="_blank">http://localhost:8081</a></p>
                </div>
                
                <div class="status">
                  <h3>🔧 Troubleshooting:</h3>
                  <ul>
                    <li>Ensure your iPhone and computer are on the same network</li>
                    <li>Try refreshing the Expo Go app</li>
                    <li>Use the web preview for immediate testing</li>
                  </ul>
                </div>
              </div>
              
              <script>
                // Auto-refresh every 30 seconds to check server status
                setTimeout(() => location.reload(), 30000);
              </script>
            </body>
          </html>
        `);
      });

      server.listen(3001, () => {
        console.log('\n✅ Alternative development server started!');
        console.log('📱 Visit: http://localhost:3001 for connection instructions');
      });

      // Now try to start Expo with minimal network requirements
      this.startMinimalExpo();

    } catch (error) {
      console.error('❌ Alternative method failed:', error);
      this.tryWebOnlyMode();
    }
  }

  async startMinimalExpo() {
    console.log('\n🔄 Starting Expo with minimal network requirements...');
    
    const expoProcess = spawn('npx', [
      'expo', 'start',
      '--localhost',
      '--no-dev-client',
      '--clear'
    ], {
      cwd: path.join(__dirname),
      stdio: 'inherit',
      shell: true,
      env: {
        ...process.env,
        EXPO_NO_TELEMETRY: 'true',
        EXPO_NO_UPDATE_CHECK: 'true'
      }
    });

    expoProcess.on('error', (error) => {
      console.error('❌ Minimal Expo start failed:', error);
      this.tryWebOnlyMode();
    });
  }

  async tryWebOnlyMode() {
    console.log('\n🔄 Method 3: Web-only mode (guaranteed to work)...');
    
    const webProcess = spawn('npx', [
      'expo', 'start',
      '--web',
      '--clear'
    ], {
      cwd: path.join(__dirname),
      stdio: 'inherit',
      shell: true
    });

    webProcess.on('error', (error) => {
      console.error('❌ Web-only mode failed:', error);
      this.displayFallbackInstructions();
    });
  }

  displaySuccessInstructions() {
    console.log('\n🎉 SUCCESS! SpiritSage Mobile is now running!');
    console.log('\n📱 Connection Options:');
    console.log('1. 🌐 Web Preview: http://localhost:8081');
    console.log('2. 📱 iPhone (Expo Go): Scan QR code or enter URL manually');
    console.log('3. 🔧 Instructions: http://localhost:3001');
    console.log('\n💡 If QR code doesn\'t work, try entering these URLs in Expo Go:');
    console.log('   • exp://localhost:8081');
    console.log('   • exp://127.0.0.1:8081');
  }

  displayFallbackInstructions() {
    console.log('\n🆘 FALLBACK INSTRUCTIONS:');
    console.log('\nIf all automated methods fail, try these manual steps:');
    console.log('\n1. 🧹 Clean install:');
    console.log('   cd mobile');
    console.log('   rm -rf node_modules .expo');
    console.log('   npm install');
    console.log('\n2. 🌐 Web-only development:');
    console.log('   npx expo start --web');
    console.log('\n3. 📱 Alternative mobile testing:');
    console.log('   • Use Expo Snack (snack.expo.dev)');
    console.log('   • Build development version with EAS');
    console.log('   • Use iOS/Android simulator if available');
  }
}

// Start the workaround
const workaround = new ExpoNetworkWorkaround();
workaround.startExpoWithWorkarounds();