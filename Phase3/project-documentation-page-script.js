// Improved syntax highlighting
function highlightSyntax(codeElement) {
  const text = codeElement.textContent;
  const tokens = [];
  let currentToken = '';
  let currentType = null;

  const types = {
    keyword: /^(public|class|static|void|function|var|let|const|if|else|for|while|return)\b/,
    type: /^(String|int|boolean|double|float|char)\b/,
    builtIn: /^(console|System|out|println|log)\b/,
    string: /^"(?:\\.|[^\\"])*"|^'(?:\\.|[^\\'])*'/,
    comment: /^\/\/.*/,
    method: /^(\w+)(?=\()/,
    number: /^-?\d+(\.\d+)?/,
    punctuation: /^[{}()[\];]/,
    operator: /^([-+*/=<>!&|^~?:])/,
    whitespace: /^\s+/,
    other: /^.+/
  };

  function tokenize(remainingText) {
    if (remainingText.length === 0) return;

    for (const [type, regex] of Object.entries(types)) {
      const match = regex.exec(remainingText);
      if (match) {
        if (currentType !== type) {
          if (currentToken) {
            tokens.push({ type: currentType, content: currentToken });
          }
          currentToken = '';
          currentType = type;
        }
        currentToken += match[0];
        tokenize(remainingText.slice(match[0].length));
        return;
      }
    }
  }

  tokenize(text);
  if (currentToken) {
    tokens.push({ type: currentType, content: currentToken });
  }

  const highlightedHtml = tokens.map(token =>
    token.type !== 'whitespace' && token.type !== 'other'
      ? `<span class="${token.type}">${escapeHtml(token.content)}</span>`
      : escapeHtml(token.content)
  ).join('');

  codeElement.innerHTML = highlightedHtml;
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('code').forEach(highlightSyntax);
});
