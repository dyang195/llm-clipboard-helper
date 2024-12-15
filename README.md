# LLMChat Clipboard Helper

A Visual Studio Code extension designed to help you copy code and search results for pasting into Large Language Model (LLM) chats like ChatGPT, Claude, or GitHub Copilot Chat. As LLM context windows grow larger, this extension makes it easy to provide extensive code context to your AI conversations.

## Features

### Copy Directory Contents
- Right-click any folder in the explorer to copy its entire contents
- Perfect for sharing entire projects or components with LLMs
- All files in the directory (and subdirectories) are copied to clipboard
- Each file is clearly separated with its relative path
- Ideal for giving LLMs full context about your codebase

### Copy Search Results with Context
- Works with VSCode's Search Editor (click "Open in Editor" in search panel)
- Leverages VSCode's built-in context controls:
  - Perfect for sharing specific code patterns with surrounding context

## Installation

Currently, you can install this extension either from the VSCode Extension Marketplace, or from this repository with the following steps:
1. Downloading the .vsix file
2. Opening VS Code
3. Going to the Extensions view
4. Clicking the "..." menu
5. Selecting "Install from VSIX..."
6. Choosing the downloaded .vsix file

## Usage

### Copying Directory Contents
1. Right-click on any folder in the VS Code explorer
2. Select "Copy Directory Contents to Clipboard"
3. Paste the contents into your LLM chat

### Copying Search Results
1. Open the search panel (Ctrl/Cmd + Shift + F)
2. Enter your search term
3. Click "Open in Editor" to open the Search Editor
4. Click the copy button in the editor toolbar
5. Paste the results into your LLM chat

## Requirements

- Visual Studio Code version 1.74.0 or higher

## Extension Settings

This extension contributes the following commands:
* `directory-copier.copyDirectory`: Copy Directory Contents to Clipboard
* `directory-copier.copySearchResults`: Copy Search Results to Clipboard

## Release Notes

### 0.1.0

Initial release:
- Copy directory contents for LLM context
- Copy search results from Search Editor

## Development

### Building the Extension

1. Clone the repository
2. Run `npm install`
3. Run `npm run compile`
4. Press F5 to launch the extension in debug mode

## Contributing

Feel free to contribute to this project by submitting issues or pull requests.
