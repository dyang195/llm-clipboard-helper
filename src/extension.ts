import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    // Command to copy directory contents
    let copyDirectoryDisposable = vscode.commands.registerCommand('directory-copier.copyDirectory', async (uri?: vscode.Uri) => {
        let targetUri: vscode.Uri;
        
        if (!uri) {
            const result = await promptForDirectory();
            if (!result) {
                vscode.window.showInformationMessage('No directory selected');
                return;
            }
            targetUri = result;
        } else {
            targetUri = uri;
        }

        try {
            const content = await getDirectoryContent(targetUri.fsPath);
            await vscode.env.clipboard.writeText(content);
            vscode.window.showInformationMessage('Directory contents copied to clipboard!');
        } catch (error) {
            vscode.window.showErrorMessage('Failed to copy directory contents: ' + error);
        }
    });

    // Command to copy search results
    let copySearchResultsDisposable = vscode.commands.registerCommand('directory-copier.copySearchResults', async () => {
        // Get the active search query
        const searchViewType = 'workbench.view.search';
        await vscode.commands.executeCommand('workbench.view.search.focus');
        
        try {
            // Use the internal search model to get results
            // @ts-ignore - Using internal API
            const searchView = vscode.window.visibleTextEditors.find(
                editor => editor.document.uri.scheme === 'search-editor'
            );

            if (!searchView) {
                vscode.window.showInformationMessage('No active search results found. Please perform a search first.');
                return;
            }

            const content = searchView.document.getText();
            if (!content) {
                vscode.window.showInformationMessage('No search results to copy.');
                return;
            }

            await vscode.env.clipboard.writeText(content);
            vscode.window.showInformationMessage('Search results copied to clipboard!');
        } catch (error) {
            console.error('Search error:', error);
            vscode.window.showErrorMessage('Failed to copy search results: ' + error);
        }
    });

    context.subscriptions.push(copyDirectoryDisposable, copySearchResultsDisposable);
}

async function promptForDirectory(): Promise<vscode.Uri | undefined> {
    const options: vscode.OpenDialogOptions = {
        canSelectFiles: false,
        canSelectFolders: true,
        canSelectMany: false,
        openLabel: 'Select Directory'
    };

    const result = await vscode.window.showOpenDialog(options);
    return result?.[0];
}

async function getDirectoryContent(directoryPath: string): Promise<string> {
    let content = '';

    const files = await walkDirectory(directoryPath);
    for (const file of files) {
        const relativePath = path.relative(directoryPath, file);
        const fileContent = await fs.promises.readFile(file, 'utf8');
        content += `File: ${relativePath}\n${fileContent}\n\n`;
    }

    return content;
}

async function walkDirectory(dir: string): Promise<string[]> {
    const files: string[] = [];
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...await walkDirectory(fullPath));
        } else {
            files.push(fullPath);
        }
    }

    return files;
}

export function deactivate() {}