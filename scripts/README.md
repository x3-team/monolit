# PDF Export Script

This script automatically converts your Monolit presentation into PDF format.

## Features

- Exports main presentation as `monolit-presentation.pdf`
- Exports deep dive slides as separate `monolit-market-size-deep-dive.pdf`
- Desktop resolution (1920x1080, 16:9 ratio)
- High quality (2x device scale factor)
- Excludes navigation elements (clean slides only)

## Usage

### Step 1: Start the development server

Make sure your presentation is running:

```bash
npm start
```

Wait for the server to start on `http://localhost:3000`

### Step 2: Run the export script

In a **new terminal window**, run:

```bash
npm run export:pdf
```

### Step 3: Find your PDFs

The PDFs will be saved in:
```
pdf-exports/
├── monolit-presentation.pdf           (Main presentation)
└── monolit-market-size-deep-dive.pdf  (Deep dive slides)
```

## Requirements

- Node.js
- The development server must be running (`npm start`)
- Dependencies installed (`puppeteer` and `pdf-lib`)

## How It Works

1. Launches a headless Chrome browser using Puppeteer
2. Navigates to your presentation at `http://localhost:3000`
3. Hides all navigation UI elements (navbar, slide counter, keyboard hints)
4. Captures each slide as a PDF page at 1920x1080 resolution
5. Combines all pages into final PDF documents
6. Saves separate PDFs for main presentation and deep dives

## Troubleshooting

**Error: "Connection refused"**
- Make sure `npm start` is running in another terminal
- Wait for the server to fully start before running export

**PDFs look wrong**
- Check that all fonts and images are loading properly
- Verify the presentation looks correct in the browser first

**Script hangs**
- Increase timeout values in `export-pdf.js`
- Check browser console for errors

## Customization

Edit `scripts/export-pdf.js` to customize:
- Output resolution (default: 1920x1080)
- PDF quality (default: 2x scale factor)
- Timeout durations
- Output file names
- CSS to hide/show different elements
