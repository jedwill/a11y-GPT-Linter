const vscode = require('vscode');
const { runAxeCheck, closeBrowserInstance } = require('./axeCheck');
const { generateUserFriendlyFeedback } = require('./feedback');
const { updateDiagnostics } = require('./diagnostics');

let diagnosticCollection;

function activate(context) {
    diagnosticCollection = vscode.languages.createDiagnosticCollection('accessibility');
    context.subscriptions.push(diagnosticCollection);

    let disposable = vscode.commands.registerCommand('accessibility-linter.checkAccessibility', async function () {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage('No active editor!');
            return;
        }

        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Running Accessibility Checks",
            cancellable: true
        }, async (progress) => {
            try {
                progress.report({ increment: 0, message: "Initializing..." });
                
                const htmlContent = editor.document.getText();
                progress.report({ increment: 20, message: "Analyzing content..." });
                
                const results = await runAxeCheck(htmlContent);
                const feedback = await generateUserFriendlyFeedback(results.violations);
                progress.report({ increment: 70, message: "Finalizing report..." });

                updateDiagnostics(editor.document, results.violations, feedback, diagnosticCollection);
                progress.report({ increment: 100, message: "Completed!" });
                vscode.window.showInformationMessage('Accessibility check complete. See the Problems pane for details.');
            } catch (error) {
                vscode.window.showErrorMessage(`Accessibility check failed: ${error.message}`);
                console.error("Accessibility Check Error:", error);
            }
        });
    });

    context.subscriptions.push(disposable);
}

function deactivate() {
    closeBrowserInstance();
    if (diagnosticCollection) {
        diagnosticCollection.clear();
        diagnosticCollection.dispose();
    }
}

module.exports = {
    activate,
    deactivate
};
