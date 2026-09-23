export default function decorate(block) {
  // field order in _quote.json decides row order: quote first, author second
  const [quoteRow, authorRow] = block.children;
  const quoteCell = quoteRow?.firstElementChild;
  const authorCell = authorRow?.firstElementChild;

  const blockquote = document.createElement('blockquote');
  blockquote.className = 'quote-text';
  // move the richtext nodes across instead of copying innerHTML,
  // so the <p> elements keep whatever attributes they carry
  while (quoteCell?.firstChild) blockquote.append(quoteCell.firstChild);

  const cite = document.createElement('cite');
  cite.className = 'quote-author';
  cite.textContent = authorCell?.textContent.trim() ?? '';

  block.textContent = '';
  block.append(blockquote, cite);
}
