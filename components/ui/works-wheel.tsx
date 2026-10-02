"use client";

// A portfolio index built as a wheel you turn.
//
// The work hangs on a vertical drum: the card at the front lies flat and full
// size, the ones above and below rotate away into hard perspective and run off
// the top and bottom of the frame. Turning the wheel carries the next piece
// round to the front, and the drum has no ends - past the last piece comes the
// first again.
//
// The whole thing is one number - `turn` - read by a single rAF pass that writes
// transforms straight to the DOM. Every whole number is one item at the front;
// the item is `turn` modulo the count, so the number can grow without bound.
//
// Adapted from the crafterui original to this site: the opening ring and the
// titles are gone, the drum loops, the cards are mounted in the site's
// hard-edged frame, the index carries each app's icon, and the shadcn colour
// tokens are mapped onto the site's own (canvas, ink, surface, muted).
import * as React from "react";

import { IconBloom } from "@/components/IconBloom";
import { cn } from "@/lib/utils";

export interface WorksWheelItem {
  /** Project name. Shown in the index and read out as the item turns past. */
  title: string;
  /** Cover art. Any src an <img> takes. */
  image: string;
  /** Small square mark shown beside the title in the index. */
  icon?: string;
  /** Where the card links to. Omit for a wheel that only browses. */
  href?: string;
}

export interface WorksWheelProps extends Omit<
  React.ComponentPropsWithoutRef<"section">,
  "children"
> {
  items: WorksWheelItem[];
  /** Accessible name for the wheel. @default "Works" */
  label?: string;
  /** Label on the card's hover affordance. Omit to drop it. @default "View" */
  action?: string;
}

/* Geometry. The card is measured against the stage; everything else is measured
   against the card, so a narrow stage - where the card is capped by width, not
   height - scales the whole wheel down with it instead of leaving a small card
   swinging on a huge drum. STEP against DRUM sets how hard the neighbours
   rotate away, and DRUM against LENS decides whether they land inside the
   frame or run off it. */
const CARD_H = 0.38; // front card height, of the stage
const CARD_MAX_W = 0.42; // ... but never wider than this much of the stage
const CARD_MAX_W_NARROW = 0.8; // ... or this much, on a phone
const NARROW = 640; // stage width below which the index is hidden
const IMAGE_RATIO = 1200 / 630; // the art inside the frame: an og-image, uncropped
const STEP = 40; // degrees between cards on the drum
const DRUM = 2.22; // drum radius, in card heights - and everything below likewise
const LENS = 2.7; // perspective distance
/* The drum alone hangs the work on a plumb line. It isn't one: the strip curves
   away round an arc whose centre sits off to the LEFT, so the piece at the front
   is at the arc's near point - dead centre - and its neighbours have already
   swung back left as well as up and down. BOW is that arc's radius; nothing else
   makes the difference between a stack of cards and a wheel seen side on. */
const BOW = 1.82;
const INDEX = 0.04; // the index down the right-hand side
const MIN_INDEX = 13; // ... in px, so it stays readable off a small card
/* The frame: a white mat round the art inside a 2px ink border, with the
   site's hard offset shadow. Sizes in px, the mat scaled to the card. */
const BORDER = 2;
const MAT = 0.022; // of the card width
const MIN_MAT = 6;
const MAX_MAT = 14;
/** Distance from the front, in items, at which a card has faded out. Past
    about two it is edge-on, and further round it would stack up on the
    vanishing point - and it is where a looping drum swaps a card from the top
    of the strip to the bottom, which has to happen out of sight. */
const FADE_FROM = 1.6;
const FADE_TO = 2;

/** How much of a wheel-notch or a dragged pixel counts as one item. */
const WHEEL_UNITS = 900;
const DRAG_UNITS = 420;
/** Px a press may travel and still count as a click rather than a drag. */
const DRAG_SLOP = 5;
/** Quiet time after the last wheel event before the wheel settles on an item. */
const SETTLE = 140;
/** Fraction of the remaining distance closed each frame. 1 = no smoothing. */
const EASE = 0.12;

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));
/** Modulo that stays positive for negative input. */
const mod = (v: number, n: number) => ((v % n) + n) % n;

type Stage = { w: number; h: number };

const rad = (deg: number) => (deg * Math.PI) / 180;

/** How far left the arc has carried something that has turned `drumDeg` off the
    front. Zero at the front, so the piece being read stays centred. */
const bowAt = (drumDeg: number, bow: number) =>
  -bow * (1 - Math.cos(rad(drumDeg)));

/** The bow is applied first, in the wheel's own plane, so it slides the card
    sideways rather than turning with it - and perspective still shrinks it
    with distance. */
function place(drumDeg: number, drumR: number, bow: number) {
  return (
    `translateX(${bowAt(drumDeg, bow)}px)` +
    ` rotateX(${drumDeg}deg) translateZ(${drumR}px)`
  );
}

export function WorksWheel({
  items,
  label = "Works",
  action = "View",
  className,
  ...props
}: WorksWheelProps) {
  const stageRef = React.useRef<HTMLDivElement>(null);
  const wheelRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLElement | null)[]>([]);

  // The wheel's position, and where it is heading. Only `active` is state -
  // everything else is written to the DOM, so turning the wheel is not a render.
  const turn = React.useRef(0);
  const target = React.useRef(0);
  const [active, setActive] = React.useState(0);
  const [stage, setStage] = React.useState<Stage>({ w: 0, h: 0 });

  const count = items.length;
  const narrow = stage.w > 0 && stage.w < NARROW;

  // Read after mount, not during render: the server has no matchMedia, and
  // branching on it inline is a hydration mismatch. Reduced motion drops the
  // easing, so the wheel lands where it is put instead of gliding there.
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const read = () => setReduced(query.matches);
    read();
    query.addEventListener("change", read);
    return () => query.removeEventListener("change", read);
  }, []);

  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const read = () => setStage({ w: el.clientWidth, h: el.clientHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const metrics = React.useMemo(() => {
    const { w, h } = stage;
    const maxW = w < NARROW ? CARD_MAX_W_NARROW : CARD_MAX_W;
    // Size the frame so the art inside it keeps its own ratio: the mat and
    // border are added around the image, not cut out of it.
    const cardW = Math.min(h * CARD_H * IMAGE_RATIO, w * maxW);
    const mat = Math.round(clamp(cardW * MAT, MIN_MAT, MAX_MAT));
    const inset = mat + BORDER;
    const cardH = (cardW - 2 * inset) / IMAGE_RATIO + 2 * inset;
    return {
      cardW,
      cardH,
      mat,
      drumR: cardH * DRUM,
      bow: cardH * BOW,
      depth: cardH * LENS,
      index: Math.max(cardH * INDEX, MIN_INDEX),
    };
  }, [stage]);

  // One pass per frame: ease toward the target, then write every transform.
  React.useEffect(() => {
    if (!stage.h || !count) return;
    let frame = 0;
    const { drumR, bow } = metrics;

    // The drum is pulled back so its front face lands on the picture plane.
    if (wheelRef.current) {
      wheelRef.current.style.transform = `translateZ(${-drumR}px)`;
    }

    const draw = () => {
      frame = requestAnimationFrame(draw);
      const gap = target.current - turn.current;
      if (Math.abs(gap) < 0.0005) turn.current = target.current;
      else turn.current += gap * (reduced ? 1 : EASE);

      const pos = turn.current;
      for (let i = 0; i < count; i++) {
        // Each card's offset from the front, taken the short way round, so
        // the strip has as many cards above the front as below it.
        const d = mod(i - pos + count / 2, count) - count / 2;
        const card = cardRefs.current[i];
        if (!card) continue;
        card.style.transform = place(d * STEP, drumR, bow);
        const fade = clamp(
          (FADE_TO - Math.abs(d)) / (FADE_TO - FADE_FROM),
          0,
          1,
        );
        card.style.opacity = String(fade);
        card.style.visibility = fade === 0 ? "hidden" : "visible";
        card.style.zIndex = String(Math.round(100 - Math.abs(d) * 2));
      }

      const near = mod(Math.round(pos), count);
      setActive((prev) => (prev === near ? prev : near));
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [metrics, stage.h, count, reduced]);

  const to = React.useCallback((next: number) => {
    target.current = next;
  }, []);

  /** Turn to item `i` the short way round from wherever the wheel is. */
  const goTo = React.useCallback(
    (i: number) => {
      const from = Math.round(target.current);
      const delta = mod(i - from + count / 2, count) - count / 2;
      to(from + Math.round(delta));
    },
    [count, to],
  );

  const drag = React.useRef<number | null>(null);
  const settling = React.useRef(0);
  // Set once a press has turned the wheel, so letting go over a card is the
  // end of a drag and not a click on its link.
  const dragged = React.useRef(0);

  // Native listener, because the wheel has to be cancellable. The drum has no
  // ends, so every wheel event over it is the wheel's: the page around it is
  // laid out to fit the viewport and has nothing to scroll.
  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      to(target.current + event.deltaY / WHEEL_UNITS);
      // A wheel gesture arrives as a burst of events with no end of its own, so
      // the rest position is whatever notch it happened to stop on. Left there
      // the drum sits between two cards - nothing at the front, and the pair
      // either side of the gap both turned half away. Settle onto an item.
      window.clearTimeout(settling.current);
      settling.current = window.setTimeout(
        () => to(Math.round(target.current)),
        SETTLE,
      );
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      window.clearTimeout(settling.current);
    };
  }, [to]);

  const release = () => {
    // Land on an item rather than between two.
    drag.current = null;
    to(Math.round(target.current));
  };

  return (
    <section
      aria-label={label}
      className={cn(
        "relative h-full w-full overflow-hidden bg-canvas text-ink select-none",
        className,
      )}
      {...props}
    >
      <div
        ref={stageRef}
        tabIndex={0}
        role="listbox"
        aria-label={label}
        aria-activedescendant={`works-wheel-${active}`}
        // touch-none: a vertical drag turns the drum on a phone as it does
        // with a mouse. The page has nothing to scroll for it to take over.
        className="absolute inset-0 cursor-grab touch-none outline-none focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ink active:cursor-grabbing"
        style={{ perspective: `${metrics.depth}px` }}
        onPointerDown={(event) => {
          drag.current = event.clientY;
          dragged.current = 0;
        }}
        onPointerMove={(event) => {
          if (drag.current === null) return;
          const dy = drag.current - event.clientY;
          dragged.current += Math.abs(dy);
          // Capture only once the press has become a drag. Captured from the
          // start, the release - and so the click - lands on the stage, not
          // on the card under the pointer, and no card link ever opens.
          if (
            dragged.current >= DRAG_SLOP &&
            !event.currentTarget.hasPointerCapture(event.pointerId)
          )
            event.currentTarget.setPointerCapture(event.pointerId);
          to(target.current + dy / DRAG_UNITS);
          drag.current = event.clientY;
        }}
        onPointerUp={release}
        onPointerCancel={release}
        onClickCapture={(event) => {
          if (dragged.current < DRAG_SLOP) return;
          dragged.current = 0;
          event.preventDefault();
          event.stopPropagation();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowRight")
            to(Math.round(target.current) + 1);
          else if (event.key === "ArrowUp" || event.key === "ArrowLeft")
            to(Math.round(target.current) - 1);
          else return;
          event.preventDefault();
        }}
      >
        <div
          ref={wheelRef}
          className="absolute top-1/2 left-1/2 [transform-style:preserve-3d]"
        >
          {items.map((item, i) => {
            const Tag = (item.href ? "a" : "div") as "a";
            return (
              <Tag
                key={item.title}
                id={`works-wheel-${i}`}
                role="option"
                aria-selected={i === active}
                aria-label={item.title}
                href={item.href}
                draggable={false}
                ref={(node: HTMLElement | null) => {
                  cardRefs.current[i] = node;
                }}
                className="group absolute [backface-visibility:hidden]"
                style={{
                  width: metrics.cardW,
                  height: metrics.cardH,
                  marginLeft: -metrics.cardW / 2,
                  marginTop: -metrics.cardH / 2,
                }}
              >
                {/* The frame: mat, ink border, hard offset shadow - the same
                    edge the blog cards and the Contact pill carry. */}
                <span
                  className="relative block size-full rounded-xl border-2 border-ink bg-surface shadow-[6px_6px_0_0_theme(colors.ink)]"
                  style={{ padding: metrics.mat }}
                >
                  <span className="relative block size-full overflow-hidden rounded-md bg-ink">
                    {/* eslint-disable-next-line @next/next/no-img-element -- per-frame 3D transforms; next/image's wrapper adds nothing here */}
                    <img
                      src={item.image}
                      alt=""
                      draggable={false}
                      decoding="async"
                      className="size-full object-cover"
                    />
                    {action && item.href ? (
                      <span className="pointer-events-none absolute right-3 bottom-3 flex translate-y-1 items-center gap-1 rounded-full bg-canvas/85 px-2.5 py-1 text-[0.7rem] text-ink opacity-0 backdrop-blur-sm transition group-hover:translate-y-0 group-hover:opacity-100">
                        <svg
                          viewBox="0 0 12 12"
                          className="size-2.5"
                          aria-hidden="true"
                        >
                          <path
                            d="M3 9 9 3M4 3h5v5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {action}
                      </span>
                    ) : null}
                  </span>
                </span>
              </Tag>
            );
          })}
        </div>
      </div>

      {/* The art carries the app's name, so nothing is set beside it; this
          says which one is at the front for anyone not seeing the art. */}
      <p className="sr-only" aria-live="polite">
        {items[active]?.title}
      </p>

      {/* The index competes with the drum for a phone's width. */}
      <ol
        className={cn(
          "absolute top-1/2 right-[2.5%] flex -translate-y-1/2 flex-col items-end gap-1 text-muted",
          narrow && "hidden",
        )}
        style={{ fontSize: metrics.index }}
      >
        {items.map((item, i) => (
          <li key={item.title}>
            <button
              type="button"
              onClick={() => goTo(i)}
              aria-current={i === active ? "true" : undefined}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-full py-0.5 pl-3 transition-colors outline-none hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
                i === active && "font-medium text-ink",
              )}
            >
              {item.title}
              {item.icon ? (
                <IconBloom
                  src={item.icon}
                  alt=""
                  size={40}
                  iconSize={16}
                  className="shrink-0"
                />
              ) : null}
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default WorksWheel;
