export default function SectionHeading({ eyebrow, title, children }) {
  return (
    <div>
      <p className="text-sm font-medium text-[#fb7185]">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      {children && <p className="muted mt-4 max-w-md text-sm leading-relaxed">{children}</p>}
    </div>
  );
}
