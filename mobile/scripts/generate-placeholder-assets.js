// Placeholder asset generator for development
// This creates simple colored rectangles as temporary assets

const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '../assets');

// Ensure assets directory exists
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

console.log('📱 SpiritSage Mobile - Asset Generator');
console.log('=====================================');
console.log('');
console.log('This script helps you understand what assets are needed.');
console.log('You will need to create actual image files using design software.');
console.log('');
console.log('Required Assets:');
console.log('');
console.log('1. App Icon (icon.png)');
console.log('   - Size: 1024x1024px');
console.log('   - Style: Minimalistic wine glass or "S" logo');
console.log('   - Colors: #6366f1 (primary), #ffffff (white)');
console.log('   - Format: PNG with transparency');
console.log('');
console.log('2. Splash Screen (splash.png)');
console.log('   - Size: 1284x2778px (iPhone 12 Pro Max)');
console.log('   - Background: Gradient #6366f1 to #4f46e5');
console.log('   - Logo: Centered, 200x200px');
console.log('   - Safe zones: 200px top, 300px bottom, 100px sides');
console.log('');
console.log('3. Notification Icon (notification-icon.png)');
console.log('   - Size: 96x96px');
console.log('   - Style: Simple wine glass silhouette');
console.log('   - Color: #6366f1 on transparent background');
console.log('');
console.log('4. Adaptive Icon (adaptive-icon.png)');
console.log('   - Size: 1024x1024px');
console.log('   - Safe area: 66% circle (680x680px center)');
console.log('   - Android adaptive icon foreground');
console.log('');
console.log('5. Favicon (favicon.png)');
console.log('   - Size: 48x48px');
console.log('   - Simple version of main icon');
console.log('');
console.log('🎨 Design Tools:');
console.log('   - Figma (free): figma.com');
console.log('   - Canva (templates): canva.com');
console.log('   - App Icon Generator: appicon.co');
console.log('');
console.log('📋 Next Steps:');
console.log('   1. Create assets using design software');
console.log('   2. Save files in mobile/assets/ directory');
console.log('   3. Run "npm start" to test the app');
console.log('');
console.log('💡 Tip: Start with simple designs and iterate!');