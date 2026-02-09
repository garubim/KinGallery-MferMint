# 📁 Farcaster Manifest Assets Generation

## 🎯 REQUIRED ASSETS for Farcaster.json:

1. **icon.png** (192x192) - App icon in Farcaster directory
2. **splash.png** (512x512) - Splash screen background
3. **hero.png** (800x400) - Hero image for app store
4. **screenshot1.png** (375x667) - App screenshot
5. **og.png** (1200x630) - Open Graph social image

## 🚀 QUICK GENERATION COMMANDS:

### Option A: Use existing KinGallery assets
```bash
# Copy and resize existing Magic Button artwork
cp "public/KinGall-Magic-Titles-op108.png" "public/icon-source.png"
```

### Option B: Generate simple placeholders
```bash
# Create basic colored rectangles with text
# (Using ImageMagick - install with: brew install imagemagick)

# App Icon (192x192)
magick -size 192x192 xc:"#1a3a52" -fill white -pointsize 24 -gravity center -annotate 0 "KG" public/icon.png

# Splash Image (512x512) 
magick -size 512x512 xc:"#05080a" -fill "#1a3a52" -pointsize 48 -gravity center -annotate 0 "KinGallery\nEntanglement Magic" public/splash.png

# Hero Image (800x400)
magick -size 800x400 gradient:"#1a3a52-#05080a" -fill white -pointsize 36 -gravity center -annotate 0 "Revolutionary Collaborative NFTs\nEach mint creates magic for the next" public/hero.png

# Screenshot (375x667) - iPhone size
magick -size 375x667 xc:"#05080a" -fill "#1a3a52" -pointsize 20 -gravity center -annotate 0 "KinGallery Screenshot\nMagic Button Interface" public/screenshot1.png

# Open Graph (1200x630)
magick -size 1200x630 gradient:"#1a3a52-#06B6D4" -fill white -pointsize 42 -gravity center -annotate 0 "KinGallery - Collaborative NFT Minting\nEach mint creates entanglement magic for the next person" public/og.png
```

## ✅ VERIFICATION:

After generation, verify all files exist:
```bash
ls -la public/*.png
file public/*.png  # Check file types
```

## 🔧 OPTIMIZATION (Optional):

```bash
# Compress PNGs for better performance
optipng public/*.png
# OR with pngcrush
pngcrush -rem alla public/icon.png public/icon-optimized.png
```

## 🎨 BRANDING COLORS:
- Primary: `#1a3a52` (Dark Blue)
- Secondary: `#05080a` (Deep Black)
- Accent: `#06B6D4` (Cyan)
- Success: `#22c55e` (Green)
- Purple: `#8B5CF6` (Magic Purple)

## 📱 FARCASTER REQUIREMENTS:
- Icon: Must be PNG, 192x192px minimum
- Splash: PNG/WebP, 512x512px recommended  
- Hero: PNG/JPG, 800x400px for app store display
- Screenshot: Real device screenshot preferred
- Open Graph: 1200x630px for social sharing