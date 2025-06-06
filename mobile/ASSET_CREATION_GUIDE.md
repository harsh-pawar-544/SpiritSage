# SpiritSage Mobile - Asset Creation Guide

## Visual Asset Specifications

### 1. App Icon (1024x1024px)
**File**: `mobile/assets/icon.png`

**Design Requirements**:
- **Style**: Minimalistic and modern
- **Format**: PNG with transparency support
- **Background**: Transparent or solid (system applies rounded corners)
- **Content**: Wine glass or spirit-related icon with "S" monogram
- **Colors**: Primary: #6366f1 (indigo), Secondary: #ffffff (white)
- **Safe Area**: Keep important elements within 80% of the canvas

**Design Elements**:
```
┌─────────────────────────┐
│                         │
│    ┌─────────────┐      │
│    │      🍷     │      │  <- Wine glass icon
│    │      S      │      │  <- Stylized "S" for SpiritSage
│    └─────────────┘      │
│                         │
└─────────────────────────┘
```

### 2. Splash Screen (1284x2778px)
**File**: `mobile/assets/splash.png`

**Design Requirements**:
- **Aspect Ratio**: iPhone 12 Pro Max (9:19.5)
- **Background**: Gradient from #6366f1 to #4f46e5
- **Logo Position**: Center, 200x200px
- **Safe Zones**: 
  - Top: 200px from edge
  - Bottom: 300px from edge
  - Sides: 100px from edge

**Layout**:
```
┌─────────────────────────┐ ← 1284px
│     Safe Zone (200px)   │
│                         │
│                         │
│         ┌─────┐         │
│         │  🍷 │         │ ← Logo 200x200px
│         │  S  │         │
│         └─────┘         │
│                         │
│                         │
│    Safe Zone (300px)    │
└─────────────────────────┘
↑ 2778px
```

### 3. Notification Icon (96x96px)
**File**: `mobile/assets/notification-icon.png`

**Design Requirements**:
- **Style**: Simple, high contrast
- **Format**: PNG with transparency
- **Background**: Transparent
- **Content**: Simplified wine glass silhouette
- **Colors**: Single color (#6366f1) with transparency

### 4. Adaptive Icon (1024x1024px)
**File**: `mobile/assets/adaptive-icon.png`

**Design Requirements**:
- **Safe Area**: 66% circle in center (680x680px)
- **Background**: Can extend to full canvas
- **Foreground**: Main icon elements within safe area

## Color Palette

```css
/* Primary Colors */
--primary-indigo: #6366f1
--primary-dark: #4f46e5
--primary-light: #818cf8

/* Secondary Colors */
--white: #ffffff
--gray-50: #f9fafb
--gray-900: #111827

/* Accent Colors */
--gold: #f59e0b
--amber: #fbbf24
```

## Typography Guidelines

**Primary Font**: System default (SF Pro on iOS, Roboto on Android)
**Weights**: Regular (400), Medium (500), Semibold (600), Bold (700)

## Icon Design Principles

1. **Simplicity**: Clean, minimal design that works at all sizes
2. **Recognition**: Instantly recognizable as a spirits/wine app
3. **Scalability**: Looks good from 16px to 1024px
4. **Consistency**: Matches app's overall design language
5. **Platform Compliance**: Follows iOS and Android design guidelines

## Asset Creation Tools

### Recommended Software:
- **Figma** (Free, web-based)
- **Sketch** (macOS)
- **Adobe Illustrator** (Subscription)
- **Canva** (Free templates available)
- **GIMP** (Free alternative)

### Online Icon Generators:
- **App Icon Generator**: appicon.co
- **Icon Kitchen**: icon.kitchen
- **MakeAppIcon**: makeappicon.com

## Asset Optimization

### Before Adding to Project:
1. **Compress images** using TinyPNG or similar
2. **Verify dimensions** exactly match specifications
3. **Test on different backgrounds** (light/dark)
4. **Check visibility** at small sizes

### File Naming Convention:
```
icon.png              # Main app icon
adaptive-icon.png     # Android adaptive icon
splash.png           # Main splash screen
notification-icon.png # Notification icon
favicon.png          # Web favicon (48x48px)
```

## Platform-Specific Considerations

### iOS:
- System automatically applies rounded corners
- Supports transparency
- Prefers subtle shadows/gradients
- Icon should fill most of the canvas

### Android:
- Adaptive icons have foreground and background layers
- Material Design principles
- Higher contrast preferred
- Safe area considerations for different shapes

### Web:
- Favicon should be simple and recognizable
- Works well in browser tabs
- Consider dark/light browser themes

## Quality Checklist

Before finalizing assets:

- [ ] All dimensions are exact
- [ ] Colors match brand palette
- [ ] Icons are recognizable at 32px size
- [ ] Splash screen works on different device sizes
- [ ] No pixelation or artifacts
- [ ] Consistent visual style across all assets
- [ ] Files are optimized for size
- [ ] Transparency is properly handled

## Implementation

Once assets are created, place them in:
```
mobile/assets/
├── icon.png
├── adaptive-icon.png
├── splash.png
├── notification-icon.png
└── favicon.png
```

The app.json is already configured to use these assets automatically.

## Alternative Solutions

If you need immediate placeholder assets:

1. **Use Expo's default icons** temporarily
2. **Generate simple text-based icons** using online tools
3. **Use emoji-based icons** as placeholders (🍷, 🥃)
4. **Create simple geometric designs** using basic shapes

## Professional Design Services

For high-quality assets, consider:
- **Fiverr**: Affordable icon design services
- **99designs**: Professional design contests
- **Dribbble**: Hire experienced designers
- **Upwork**: Freelance graphic designers

Remember: Good app icons significantly impact download rates and user perception!