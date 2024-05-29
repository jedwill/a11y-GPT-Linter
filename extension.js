const vscode = require('vscode');
const puppeteer = require('puppeteer');
const { AxePuppeteer } = require('@axe-core/puppeteer');
const axios = require('axios');

let diagnosticCollection;

async function runAxeCheck(htmlContent) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent);
  const axe = new AxePuppeteer(page);
  const results = await axe.analyze();
  await browser.close();
  return results;
}

async function generateUserFriendlyFeedback(violations) {
  if (!violations || violations.length === 0) {
    return ["No accessibility issues found. Great job!"];
  }

  let feedbackResponses = [];

  for (const violation of violations) {
    const prompt = `Describe the following accessibility issue and provide a simple HTML code example on how to fix it:\nIssue: ${violation.description}\nHTML: ${violation.nodes.map(node => node.html).join(", ")}\nImpact: ${violation.impact}`;
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: "You are an assistant that provides explanations and code examples for fixing accessibility issues." },
            { role: "user", content: prompt }
        ],
        max_tokens: 500
    }, {
        headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` }
    });

    if (response.data.choices && response.data.choices.length > 0) {
      const feedbackContent = response.data.choices[0].message.content;
      feedbackResponses.push(feedbackContent.trim());
    } else {
      feedbackResponses.push("Feedback unavailable.");
    }
  }

  return feedbackResponses;
}

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
      progress.report({ increment: 0, message: "Initializing..." });
      
      const htmlContent = editor.document.getText();
      progress.report({ increment: 20, message: "Analyzing content..." });
      
      const results = await runAxeCheck(htmlContent);
      const feedback = await generateUserFriendlyFeedback(results.violations);

      progress.report({ increment: 70, message: "Finalizing report..." });
      updateDiagnostics(editor.document, results.violations, feedback);

      progress.report({ increment: 100, message: "Completed!" });
      vscode.window.showInformationMessage('Accessibility check complete. See the Problems pane for details.');
    });
  });

  context.subscriptions.push(disposable);
}

function updateDiagnostics(document, violations, feedback) {
  const diagnostics = [];
  const text = document.getText();

  violations.forEach((violation, feedbackIndex) => {
    violation.nodes.forEach(node => {
      const nodeIndex = text.indexOf(node.html);
      if (nodeIndex === -1) {
        return; // Skip if the snippet can't be found
      }

      const startPos = document.positionAt(nodeIndex);
      const endPos = document.positionAt(Math.min(nodeIndex + node.html.length, text.length));
      const range = new vscode.Range(startPos, endPos);
      const message = `${violation.description} (Impact: ${violation.impact})\nSuggested Fix:\n${feedback[feedbackIndex]}`;
      const diagnostic = new vscode.Diagnostic(range, message, vscode.DiagnosticSeverity.Warning);

      diagnostics.push(diagnostic);
    });
  });

  diagnosticCollection.set(document.uri, diagnostics);
}

function deactivate() {
  diagnosticCollection.clear();
}

module.exports = {
  activate,
  deactivate
};