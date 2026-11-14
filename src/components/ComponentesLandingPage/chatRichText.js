// Parses the small Markdown subset that "Foody" is allowed to emit into a block AST,
// so the chat can render bold text, headings and bullet lists with real styling
// instead of showing raw asterisks.
//
// Supported on purpose (and nothing else):
//   ## Heading            -> heading block
//   - item / * item / •   -> list block (indented bullets keep their nesting level)
//   **bold**              -> bold span
//   [label](url)          -> link span
//   bare https://...      -> link span
// Anything else stays literal text, so a stray asterisk is never swallowed.

const INLINE_PATTERN =
  /\*\*(.+?)\*\*|\[([^\]]+)\]\(((?:https?:\/\/|\/)[^\s)]+)\)|(https?:\/\/[^\s)]+)/g;

const HEADING_PATTERN = /^\s{0,3}(#{1,6})\s+(.*)$/;
const BULLET_PATTERN = /^(\s*)[-*•]\s+(.*)$/;

// Nesting level (0-2) from the bullet's indentation: the model nests
// evento > puesto > producto with 2-4 spaces per level.
const bulletLevel = (indent) => {
  const width = indent.replace(/\t/g, '    ').length;
  if (width >= 6) return 2;
  if (width >= 2) return 1;
  return 0;
};

/**
 * Splits one line into inline spans: plain text, bold and links.
 * Returns an array of { type, value } / { type:'link', label, href }.
 */
export const parseInline = (line) => {
  const text = typeof line === 'string' ? line : '';
  const spans = [];
  let lastIndex = 0;
  let match;

  // A fresh regex per call: parseInline recurses for bold-wrapped links, and a
  // shared /g regex would have its lastIndex clobbered by the inner call.
  const pattern = new RegExp(INLINE_PATTERN.source, 'g');
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      spans.push({ type: 'text', value: text.slice(lastIndex, match.index) });
    }

    if (match[1] !== undefined) {
      // The model often wraps a link in bold ("**[Evento](url)**"). Parsing the
      // inner content keeps the link clickable instead of showing raw markdown.
      const inner = parseInline(match[1]);
      spans.push(
        ...inner.map((span) =>
          span.type === 'text' ? { type: 'bold', value: span.value } : span
        )
      );
    } else {
      const href = match[3] || match[4];
      const label = match[2] || match[4];
      spans.push({ type: 'link', label, href });
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    spans.push({ type: 'text', value: text.slice(lastIndex) });
  }

  return spans;
};

/**
 * Turns a full answer into blocks: { type:'heading'|'paragraph'|'list', ... }.
 * Consecutive bullet lines are grouped into a single list block; `levels[i]`
 * holds the nesting level (0-2) of `items[i]`.
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
      if (!currentList) currentList = { type: 'list', items: [], levels: [] };
      currentList.items.push(parseInline(bullet[2]));
      currentList.levels.push(bulletLevel(bullet[1]));
      continue;
    }

    closeList();
    blocks.push({ type: 'paragraph', spans: parseInline(line) });
  }

  closeList();
  return blocks;
};

/**
 * While an answer is still being written, hides the unfinished markdown at its end
 * ("**neg", "[Burger de len", "[Burger](https://qf.app/prod") so it never flashes as
 * raw symbols and then jumps into a link or bold text.
 */
export const recortarMarkdownIncompleto = (texto) => {
  let t = typeof texto === 'string' ? texto : '';
  const ultimoCorchete = t.lastIndexOf('[');
  if (ultimoCorchete !== -1 && !/^\[[^\]]*\]\([^)\s]*\)/.test(t.slice(ultimoCorchete))) {
    t = t.slice(0, ultimoCorchete);
  }
  const marcas = t.match(/\*\*/g);
  if (marcas && marcas.length % 2 === 1) t = t.slice(0, t.lastIndexOf('**'));
  return t.replace(/(^|[^*])\*$/, '$1');
};
