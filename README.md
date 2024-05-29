# a11y-GPT-Linter

## About The Project

The `a11y-GPT-Linter` is a Visual Studio Code extension designed to enhance web accessibility by leveraging the powerful combination of GPT (Generative Pre-trained Transformer) AI and Axe-Core for automated accessibility testing. This tool provides real-time feedback and suggestions for improving the accessibility of HTML content, making it invaluable for developers aiming to adhere to WCAG standards.

### Built With

- [Visual Studio Code API](https://code.visualstudio.com/api)
- [Puppeteer](https://pptr.dev/)
- [Axe-Core](https://github.com/dequelabs/axe-core)
- [OpenAI GPT](https://openai.com/api/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- [Node.js](https://nodejs.org/)
- [npm](https://npmjs.com/)
```bash
npm install npm@latest -g
```

## Installation
1. Clone the repo
```bash
git clone https://github.com/yourusername/a11y-gpt-linter.git
cd a11y-gpt-linter
```
2. Install NPM packages
```bash
npm install
```
3. Open in VS Code
4. Press Press F5 to open a new window with your extension loaded.
5. Open or create a new HTML file to start using the a11y-GPT-Linter.

## Usage 
Once the extension is installed and active, it will automatically run accessibility checks on the HTML content in your active editor.
1. Open an HTML file - The linter will automatically trigger on HTML content.
2. View Problems - Accessibility issues will appear in the 'Problems' pane of VS Code.
3. Apply Suggestions - Use the provided fixes and recommendations to improve accessibility.
