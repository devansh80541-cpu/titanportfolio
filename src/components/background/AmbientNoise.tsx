/**
 * Fixed film-grain layer. Sits above content (pointer-events: none)
 * so the whole viewport shares one editorial texture.
 */
export default function AmbientNoise() {
  return (
    <div
      aria-hidden
      className="noise-overlay pointer-events-none fixed inset-0 z-[90] opacity-[0.05]"
    />
  );
}
