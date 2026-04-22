const NUMBER_CAPTURE = /([0-9]+(?:\.[0-9]+)?)/g;

function normalizeMoneyText(text) {
  return text.replace(/,/g, '').replace(/\$/g, '');
}

/** Last currency-like number in the string (e.g. row ending with balance). */
export function parseLastDollarAmount(text) {
  if (text == null) throw new Error('text is null');
  const normalized = normalizeMoneyText(text);
  let last = null;
  const re = new RegExp(NUMBER_CAPTURE.source, 'g');
  let match;
  while ((match = re.exec(normalized)) !== null) {
    last = parseFloat(match[1]);
  }
  if (last === null) throw new Error(`No number found in: ${text}`);
  return last;
}

/**
 * Largest amount written as `$…` or `$ …` in the text.
 * Use for account table rows where `parseLastDollarAmount` can pick a trailing `$0` minimum.
 */
export function parseLargestDollarAmount(text) {
  if (text == null) throw new Error('text is null');
  const amounts = [];
  const re = /\$\s*([\d,]+(?:\.\d+)?)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const n = parseFloat(m[1].replace(/,/g, ''));
    if (!Number.isNaN(n)) amounts.push(n);
  }
  if (amounts.length === 0) return parseLastDollarAmount(text);
  return Math.max(...amounts);
}
