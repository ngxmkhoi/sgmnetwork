type RichTextRendererProps = {
  html: string;
};

export function injectHeadingIds(html: string): string {
  let i = 0;
  return html.replace(/<(h[1-6])([^>]*)>/gi, (_, tag, attrs) => {
    return `<${tag}${attrs} id="heading-${i++}">`;
  });
}

export function RichTextRenderer({ html }: RichTextRendererProps) {
  const processedHtml = injectHeadingIds(html);
  return (
    <article
      className="prose dark:prose-invert max-w-none prose-headings:font-heading prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-h5:text-sm prose-h6:text-sm"
      dangerouslySetInnerHTML={{ __html: processedHtml }}
    />
  );
}
