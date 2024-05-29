const vscode = require('vscode');

function updateDiagnostics(document, violations, feedback, diagnosticCollection) {
    const diagnostics = [];
    const text = document.getText();

    violations.forEach((violation, feedbackIndex) => {
        violation.nodes.forEach(node => {
            const nodeIndex = text.indexOf(node.html);
            if (nodeIndex === -1) return; // Skip if the snippet can't be found

            const startPos = document.positionAt(nodeIndex);
            const endPos = document.positionAt(nodeIndex + node.html.length);
            const range = new vscode.Range(startPos, endPos);
            const message = `${violation.description} (Impact: ${violation.impact})\nSuggested Fix:\n${feedback[feedbackIndex]}`;
            const diagnostic = new vscode.Diagnostic(range, message, vscode.DiagnosticSeverity.Warning);
            diagnostics.push(diagnostic);
        });
    });

    diagnosticCollection.set(document.uri, diagnostics);
}

module.exports = { updateDiagnostics };
