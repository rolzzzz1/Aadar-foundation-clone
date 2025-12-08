# Image Watermarking Guide

## Overview

An invisible Aadar logo watermark has been added to all images on your website. The watermark is applied client-side using canvas technology.

## How It Works

1. **Automatic Application**: Watermarks are automatically applied to all images when pages load
2. **Invisible Watermark**: Uses very low opacity (5%) so the watermark is not visible to the naked eye
3. **Dynamic Images**: Uses MutationObserver to watermark images added dynamically to the page
4. **Logo-Based**: Uses the Aadar logo from `assets/images/logos/logo-aadar.jpg`

## Current Settings

- **Opacity**: 0.05 (5% - nearly invisible)
- **Scale**: 0.25 (25% of image size)
- **Position**: Center
- **Repeat**: Single watermark per image

## Customization

You can adjust watermark settings in `src/App.js`:

```javascript
const watermarkOptions = {
  opacity: 0.05,    // 0.0 to 1.0 (lower = more invisible)
  scale: 0.25,      // 0.1 to 1.0 (size relative to image)
  position: "center", // "center", "bottom-right", "bottom-left", "top-right", "top-left"
  repeat: false,    // true to repeat watermark across image
};
```

## Limitations of Client-Side Watermarking

⚠️ **Important**: Client-side watermarking can be bypassed by:
- Disabling JavaScript
- Accessing images directly via URL
- Using browser DevTools
- Viewing page source

## Recommended: Server-Side Watermarking

For stronger protection, implement server-side watermarking:

### Option 1: Pre-process Images (Recommended)

Process images before uploading to your server:

**Using ImageMagick (Command Line)**
```bash
# Add watermark to all images in a directory
for img in *.jpg *.png; do
  convert "$img" \
    -gravity center \
    -draw "image Over 0,0 0,0 'logo-aadar.jpg'" \
    -alpha set -channel A -evaluate multiply 0.05 +channel \
    "watermarked_$img"
done
```

**Using Sharp (Node.js)**
```javascript
const sharp = require('sharp');
const fs = require('fs');

async function watermarkImage(inputPath, outputPath, logoPath) {
  await sharp(inputPath)
    .composite([{
      input: logoPath,
      gravity: 'center',
      blend: 'over',
      opacity: 0.05
    }])
    .toFile(outputPath);
}
```

**Using PIL (Python)**
```python
from PIL import Image, ImageEnhance

def watermark_image(input_path, output_path, logo_path, opacity=0.05):
    base_image = Image.open(input_path)
    watermark = Image.open(logo_path)
    
    # Resize watermark
    watermark_size = (int(base_image.width * 0.25), int(base_image.height * 0.25))
    watermark = watermark.resize(watermark_size, Image.Resampling.LANCZOS)
    
    # Apply opacity
    watermark = watermark.convert("RGBA")
    alpha = watermark.split()[3]
    alpha = ImageEnhance.Brightness(alpha).enhance(opacity)
    watermark.putalpha(alpha)
    
    # Position watermark
    position = ((base_image.width - watermark.width) // 2,
                (base_image.height - watermark.height) // 2)
    
    # Composite
    base_image.paste(watermark, position, watermark)
    base_image.save(output_path, "JPEG", quality=92)
```

### Option 2: On-the-Fly Watermarking

Watermark images when they're requested:

**Using Express.js + Sharp**
```javascript
const express = require('express');
const sharp = require('sharp');
const app = express();

app.get('/images/:filename', async (req, res) => {
  const { filename } = req.params;
  const inputPath = `./uploads/${filename}`;
  const logoPath = './assets/logo-aadar.jpg';
  
  const watermarked = await sharp(inputPath)
    .composite([{
      input: logoPath,
      gravity: 'center',
      blend: 'over',
      opacity: 0.05
    }])
    .jpeg({ quality: 92 })
    .toBuffer();
  
  res.type('image/jpeg');
  res.send(watermarked);
});
```

**Using Cloudinary (SaaS)**
```javascript
// Cloudinary automatically applies watermarks
const url = cloudinary.url('image.jpg', {
  overlay: 'logo-aadar',
  opacity: 5,
  gravity: 'center',
  width: 0.25,
  flags: 'relative'
});
```

## Testing

1. **Check Watermark Visibility**: 
   - Open browser DevTools
   - Inspect an image
   - The watermark should be embedded in the image data

2. **Verify All Images**:
   - Navigate through your website
   - Check that all images have watermarks applied

3. **Performance**:
   - Monitor page load times
   - Client-side watermarking adds minimal overhead

## Troubleshooting

**Watermark not appearing:**
- Check browser console for errors
- Verify logo file exists at `assets/images/logos/logo-aadar.jpg`
- Ensure images are fully loaded before watermarking

**Performance issues:**
- Reduce watermark scale
- Process fewer images at once
- Consider server-side watermarking for better performance

**Watermark too visible:**
- Reduce opacity value (try 0.02 or 0.03)
- Adjust position to less visible area

## Best Practices

1. **Combine with Server-Side**: Use both client and server-side watermarking
2. **Watermark Source Images**: Always watermark original images before upload
3. **Legal Protection**: Add copyright notices to your Terms of Use
4. **Monitor Usage**: Track image access patterns
5. **Regular Updates**: Update watermark design periodically

## Additional Security

- Use visible watermarks for critical images
- Implement DRM for highly sensitive content
- Consider using image fingerprinting
- Add metadata to images with copyright information

