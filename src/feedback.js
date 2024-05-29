const { fetchFeedback } = require('./api');

async function generateUserFriendlyFeedback(violations) {
  if (!violations || violations.length === 0) {
    return ["No accessibility issues found. Great job!"];
  }

  let feedbackResponses = [];

  for (const violation of violations) {
    const prompt = `Describe the following accessibility issue and provide a simple HTML code example on how to fix it:\nIssue: ${violation.description}\nHTML: ${violation.nodes.map(node => node.html).join(", ")}\nImpact: ${violation.impact}`;
    const feedbackContent = await fetchFeedback(prompt);
    feedbackResponses.push(feedbackContent);
  }

  return feedbackResponses;
}

module.exports = { generateUserFriendlyFeedback };
