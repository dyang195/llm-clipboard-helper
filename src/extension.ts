import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    // Unified command to copy contents
    let copyContentsDisposable = vscode.commands.registerCommand('directory-copier.copyContents', async (uri: vscode.Uri, selectedFiles?: vscode.Uri[]) => {
        try {
            let filesToProcess: vscode.Uri[] = [];
            
            // Get workspace root
            const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
            if (!workspaceRoot) {
                vscode.window.showErrorMessage('No workspace folder is open');
                return;
            }

            // Handle multi-selection case
            if (selectedFiles && selectedFiles.length > 0) {
                filesToProcess = selectedFiles;
            }
            // Handle single folder case
            else if (uri) {
                const stats = await fs.promises.stat(uri.fsPath);
                if (stats.isDirectory()) {
                    filesToProcess = [uri];
                } else {
                    vscode.window.showInformationMessage('Please select a folder or multiple items');
                    return;
                }
            }
            // If nothing is provided, prompt for directory
            else {
                const result = await promptForDirectory();
                if (!result) {
                    vscode.window.showInformationMessage('No directory selected');
                    return;
                }
                filesToProcess = [result];
            }

            let content = '';

            for (const fileUri of filesToProcess) {
                try {
                    const stats = await fs.promises.stat(fileUri.fsPath);
                    
                    if (stats.isDirectory()) {
                        // If it's a directory, get all its contents
                        const dirContent = await getDirectoryContent(fileUri.fsPath, workspaceRoot);
                        content += dirContent;
                    } else {
                        // For files (only in multi-selection case)
                        const relativePath = path.relative(workspaceRoot, fileUri.fsPath);
                        const fileContent = await fs.promises.readFile(fileUri.fsPath, 'utf8');
                        content += `File: ${relativePath}\n${fileContent}\n\n`;
                    }
                } catch (error) {
                    console.error(`Error processing ${fileUri.fsPath}:`, error);
                    continue; // Skip failed files but continue with others
                }
            }

            if (content) {
                await vscode.env.clipboard.writeText(content);
                vscode.window.showInformationMessage('Contents copied to clipboard!');
            } else {
                vscode.window.showInformationMessage('No valid files to copy');
            }
        } catch (error) {
            vscode.window.showErrorMessage('Failed to copy contents: ' + error);
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

    context.subscriptions.push(copyContentsDisposable, copySearchResultsDisposable);
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

async function getDirectoryContent(directoryPath: string, workspaceRoot: string): Promise<string> {
    let content = '';

    const files = await walkDirectory(directoryPath);
    for (const file of files) {
        const relativePath = path.relative(workspaceRoot, file);
        const fileContent = await fs.promises.readFile(file, 'utf8');
        content += `File: ${relativePath}\n${fileContent}\n\n`;
    }

    return content;
}

async function walkDirectory(dir: string): Promise<string[]> {
    const files: string[] = [];
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
        // Skip .DS_Store files
        if (entry.name === '.DS_Store') {
            continue;
        }

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