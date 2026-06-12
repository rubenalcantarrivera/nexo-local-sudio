import { cn } from "@/lib/utils";

type ImageAsset = { src: string; alt: string };
type ImagePanelProps = {
  image?: ImageAsset;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  label?: string;
};

export function ImagePanel({ image, className, imageClassName, priority = false, label }: ImagePanelProps) {
  return (
    <figure className={cn("group relative overflow-hidden rounded-[2rem] border border-white/50 bg-brand-softAccent shadow-soft", className)}>
      {image ? (
        <img
          src={image.src}
          alt={image.alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className={cn("h-full min-h-[260px] w-full object-cover transition duration-700 group-hover:scale-[1.04]", imageClassName)}
        />
      ) : (
        <div className="h-full min-h-[260px] bg-line-grid" aria-hidden="true" />
      )}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(11,18,32,0)_42%,rgba(11,18,32,.36)_100%)]" />
      {label ? (
        <figcaption className="absolute bottom-4 left-4 right-4 text-xs font-semibold uppercase tracking-[0.22em] text-white/75">
          {label}
        </figcaption>
      ) : null}
    </figure>
  );
}
