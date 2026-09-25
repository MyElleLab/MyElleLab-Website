import type { ReactNode } from "react";

/**
 * The frame for anything visual inside a post body.
 *
 * It is the cover image's treatment, deliberately: 16:9, the prose measure's
 * full width, the same 16px radius and hairline rule, and `my-7`, which is
 * what the MDX `img` mapping already uses. A figure and a cover on the same
 * page should look like the same object, and a future animation should be
 * able to drop in here without anyone redesigning the frame around it.
 *
 * The aspect ratio is on the frame rather than on the contents, so the height
 * is reserved before the contents paint. Nothing below a figure moves while
 * it loads or while it animates.
 *
 * The caption is real text in a real figcaption, in the small muted type the
 * byline and date use. Where the visual is decorative, as an animated
 * diagram usually is, the caption is what carries the meaning, so it is not
 * optional in practice even though it is optional in the type.
 */
export function Figure({
  caption,
  children,
}: {
  caption?: string;
  children: ReactNode;
}) {
  return (
    <figure className="my-7">
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-rule bg-canvas">
        {children}
      </div>
      {caption && (
        <figcaption className="mt-3 font-sans text-sm text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
