# Instant Search

A Chrome extension that shows AI-powered summaries and dictionary definitions when you double-click any word on any webpage.

## Features

- **Double-click any word** to see a tooltip with results
- **AI summaries** via Gemini or Claude (optional, requires API key)
- **Dictionary definitions** from the Free Dictionary API (works out of the box, no key needed)
- **Wikipedia and Google Search** buttons for quick follow-up
- **Dark mode** support (follows your system theme)
- Tooltip dismisses on click outside, Escape key, or scrolling

## Install (developer mode)

Since this extension isn't on the Chrome Web Store yet, you'll need to load it manually:

1. **Clone the repo**

   ```
   git clone https://github.com/byebrianwong/instant-search.git
   ```

2. **Open Chrome's extension page**

   Navigate to `chrome://extensions` in your browser.

3. **Enable Developer mode**

   Toggle the "Developer mode" switch in the top-right corner.

4. **Load the extension**

   Click **"Load unpacked"** and select the `instant-search` folder you just cloned.

5. **Pin it (optional)**

   Click the puzzle-piece icon in Chrome's toolbar and pin **Instant Search** for easy access to settings.

## Setup

The extension works immediately with **dictionary-only mode** (no API key required).

To enable AI summaries, click the extension icon and configure a provider:

| Provider | How to get a key | Cost |
| --- | --- | --- |
| **Gemini** | [Google AI Studio](https://aistudio.google.com/apikey) | Free tier available |
| **Claude** | [Anthropic Console](https://console.anthropic.com/) | Pay-per-use |

1. Click the Instant Search icon in the toolbar.
2. Select **Gemini** or **Claude**.
3. Paste your API key and click **Save Settings**.

## Usage

1. Double-click any word on any webpage.
2. A tooltip appears with:
   - An AI-generated summary (if an AI provider is configured)
   - Dictionary definitions with parts of speech and examples
   - Quick-action buttons for Wikipedia and Google Search
3. Click outside the tooltip, press **Escape**, or scroll to dismiss it.

## Project structure

```
instant-search/
  manifest.json            # Chrome extension manifest (MV3)
  background/
    service-worker.js      # API calls to Gemini, Claude, and Dictionary
  content/
    content.js             # Double-click listener and tooltip UI
  popup/
    popup.html             # Settings popup
    popup.css
    popup.js
  icons/
    icon16.png
    icon32.png
    icon48.png
    icon128.png
```

## License

MIT
