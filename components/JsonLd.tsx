/**
 * Emits one schema.org object as a JSON-LD script tag.
 *
 * The `<` escape matters: a bare JSON.stringify would let any string
 * containing "</script>" close the tag early and turn the rest of the payload
 * into markup. Nothing on this site is user-supplied today, but the component
 * is the wrong place to assume that stays true.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
