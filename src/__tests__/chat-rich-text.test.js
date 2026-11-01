import { parseChatText, parseInline } from '../components/ComponentesLandingPage/chatRichText';

describe('parseInline', () => {
  test('splits bold spans', () => {
    expect(parseInline('La **fecha** es hoy')).toEqual([
      { type: 'text', value: 'La ' },
      { type: 'bold', value: 'fecha' },
      { type: 'text', value: ' es hoy' },
    ]);
  });

  test('splits markdown links', () => {
    expect(parseInline('Ver [Cosquín](https://qf.app/x)')).toEqual([
      { type: 'text', value: 'Ver ' },
      { type: 'link', label: 'Cosquín', href: 'https://qf.app/x' },
    ]);
  });

  test('splits bare urls', () => {
    expect(parseInline('ir a https://qf.app/x ya')).toEqual([
      { type: 'text', value: 'ir a ' },
      { type: 'link', label: 'https://qf.app/x', href: 'https://qf.app/x' },
      { type: 'text', value: ' ya' },
    ]);
  });

  test('keeps relative links', () => {
    expect(parseInline('[Puestos](/listado-puestos/10)')).toEqual([
      { type: 'link', label: 'Puestos', href: '/listado-puestos/10' },
    ]);
  });

  test('leaves a lone asterisk as literal text', () => {
    expect(parseInline('2 * 3 = 6')).toEqual([{ type: 'text', value: '2 * 3 = 6' }]);
  });

  test('handles empty and non-string input', () => {
    expect(parseInline('')).toEqual([]);
    expect(parseInline(undefined)).toEqual([]);
  });

  // The model frequently wraps a link in bold ("**[Evento](url)**"). Treating the
  // whole thing as bold text left the answer without a clickable link.
  test('keeps a link clickable when it is wrapped in bold', () => {
    expect(parseInline('**[Cosquín](https://qf.app/x)**')).toEqual([
      { type: 'link', label: 'Cosquín', href: 'https://qf.app/x' },
    ]);
  });

  test('keeps bold text around a bold-wrapped link', () => {
    expect(parseInline('**Ver [Cosquín](https://qf.app/x) ahora**')).toEqual([
      { type: 'bold', value: 'Ver ' },
      { type: 'link', label: 'Cosquín', href: 'https://qf.app/x' },
      { type: 'bold', value: ' ahora' },
    ]);
  });

  test('parses several bold-wrapped links in the same line', () => {
    const spans = parseInline('**[A](https://qf.app/a)** y **[B](https://qf.app/b)**');
    expect(spans.filter((s) => s.type === 'link')).toEqual([
      { type: 'link', label: 'A', href: 'https://qf.app/a' },
      { type: 'link', label: 'B', href: 'https://qf.app/b' },
    ]);
  });
});

describe('parseChatText', () => {
  test('groups consecutive bullets into one list block', () => {
    const blocks = parseChatText('- Choripán\n- Empanada\n- Agua');
    expect(blocks).toHaveLength(1);
    expect(blocks[0].type).toBe('list');
    expect(blocks[0].items).toHaveLength(3);
  });

  test('parses headings', () => {
    const blocks = parseChatText('## Detalles');
    expect(blocks[0]).toMatchObject({ type: 'heading', level: 2 });
  });

  test('separates paragraphs from lists', () => {
    const blocks = parseChatText('Mirá esto:\n- uno\n- dos\n\nY listo.');
    expect(blocks.map((b) => b.type)).toEqual(['paragraph', 'list', 'paragraph']);
  });

  test('keeps bold inside list items', () => {
    const blocks = parseChatText('- **Choripán**: 3500');
    expect(blocks[0].items[0]).toEqual([
      { type: 'bold', value: 'Choripán' },
      { type: 'text', value: ': 3500' },
    ]);
  });

  test('returns no blocks for blank input', () => {
    expect(parseChatText('')).toEqual([]);
    expect(parseChatText('   \n  ')).toEqual([]);
    expect(parseChatText(null)).toEqual([]);
  });

  test('does not lose text when markdown is malformed', () => {
    const blocks = parseChatText('**sin cerrar y [link roto](');
    const flat = JSON.stringify(blocks);
    expect(flat).toContain('sin cerrar');
  });
});
