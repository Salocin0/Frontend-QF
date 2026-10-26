// Parses the small Markdown subset that "Foody" is allowed to emit into a block AST,
// so the chat can render bold text, headings and bullet lists with real styling
// instead of showing raw asterisks.
//
// Supported on purpose (and nothing else):
//   ## Heading            -> heading block
//   - item / * item / •   -> list block
//   **bold**              -> bold span
//   [label](url)          -> link span
//   bare https://...      -> link span
// Anything else stays literal text, so a stray asterisk is never swallowed.

const INLINE_PATTERN =
  /\*\*(.+?)\*\*|\[([^\]]+)\]\(((?:https?:\/\/|\/)[^\s)]+)\)|(https?:\/\/[^\s)]+)/g;

const HEADING_PATTERN = /^\s{0,3}(#{1,6})\s+(.*)$/;
const BULLET_PATTERN = /^\s*[-*•]\s+(.*)$/;

/**
 * Splits one line into inline spans: plain text, bold and links.
 * Returns an array of { type, value } / { type:'link', label, href }.
 */
export const parseInline = (line) => {
  const text = typeof line === 'string' ? line : '';
  const spans = [];
  let lastIndex = 0;
  let match;

  INLINE_PATTERN.lastIndex = 0;
  while ((match = INLINE_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      spans.push({ type: 'text', value: text.slice(lastIndex, match.index) });
    }

    if (match[1] !== undefined) {
      spans.push({ type: 'bold', value: match[1] });
    } else {
      const href = match[3] || match[4];
      const label = match[2] || match[4];
      spans.push({ type: 'link', label, href });
    }

    lastIndex = INLINE_PATTERN.lastIndex;
  }

  if (lastIndex < text.length) {
    spans.push({ type: 'text', value: text.slice(lastIndex) });
  }

  return spans;
};

/**
 * Turns a full answer into blocks: { type:'heading'|'paragraph'|'list', ... }.
 * Consecutive bullet lines are grouped into a single list block.
 */
export const parseChatText = (text) => {
  if (typeof text !== 'string' || !text.trim()) return [];

  const blocks = [];
  let currentList = null;

  const closeList = () => {
    if (currentList) {
      blocks.push(currentList);
      currentList = null;
    }
  };

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trimEnd();

    if (!line.trim()) {
      closeList();
      continue;
    }

    const heading = HEADING_PATTERN.exec(line);
    if (heading) {
      closeList();
      blocks.push({
        type: 'heading',
        level: heading[1].length,
        spans: parseInline(heading[2]),
      });
      continue;
    }

    const bullet = BULLET_PATTERN.exec(line);
    if (bullet) {
      if (!currentList) currentList = { type: 'list', items: [] };
      currentList.items.push(parseInline(bullet[1]));
      continue;
    }

    closeList();
    blocks.push({ type: 'paragraph', spans: parseInline(line) });
  }

  closeList();
  return blocks;
};
