# LLM Clipboard Helper

A Visual Studio Code extension that provides utilities for copying code and search results when working with AI language models (like ChatGPT, Claude, or Microsoft Copilot). Adds convenient copy commands to help you share code context in AI chats.

This extension is an open source project being actively developed, and contributions are very welcome! Feel free to submit feature requests, bug reports, or pull requests to help make it even better.

## Usage

### Copying Contents
1. Either:
   - Right-click on any folder in the VS Code explorer
   - Select multiple items (using Shift+Click or Ctrl/Cmd+Click) and right-click
2. Select "Copy All Contents"
3. Paste the contents into your LLM chat

### Copying Search Results
1. Open the search panel (Ctrl/Cmd + Shift + F)
2. Enter your search term
3. Click "Open in Editor" to open the Search Editor
4. Click the copy button in the editor toolbar
5. Paste the results into your LLM chat

## Installation

Currently, you can install this extension either from the VSCode Extension Marketplace, or from the GitHub repository with the following steps:
1. Downloading the .vsix file
2. Opening VS Code
3. Going to the Extensions view
4. Clicking the "..." menu
5. Selecting "Install from VSIX..."
6. Choosing the downloaded .vsix file

## Requirements

- Visual Studio Code version 1.74.0 or higher

## Release Notes

### 0.1.0

Initial release:
- Copy contents of folders and multiple selected items for LLM context
- Copy search results from Search Editor

## Development

### Building the Extension

1. Clone the repository
2. Run `npm install`
3. Run `npm run compile`
4. Press F5 to launch the extension in debug mode

## Contributing

Feel free to contribute to this project by submitting issues or pull requests.