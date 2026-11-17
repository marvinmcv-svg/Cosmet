import clsx from "clsx";

type Props = {
  eyebrow: string;
  title: string;
  script?: string;
  lead?: string;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
};

export default function SectionHeading({ eyebrow, title, script, lead, align = "left", dark, className }: Props) {
  return (
    <header data-reveal className={clsx(align === "center" && "mx-auto text-center", "max-w-3xl", className)}>
      <p className={clsx("eyebrow", dark ? "text-rose" : "text-berry")}>{eyebrow}</p>
      <h2 className="display mt-5 text-[clamp(3rem,7.5vw,6.5rem)]">
        {title}
        {script && (
          <>
            {" "}
            <span className={clsx("script inline-block pr-2 text-[0.85em]", dark ? "text-petal" : "text-berry")}>{script}</span>
          </>
        )}
      </h2>
      {lead && <p className={clsx("mt-6 text-lg leading-relaxed", align === "center" && "mx-auto", "max-w-xl", dark ? "text-cream/65" : "text-muted")}>{lead}</p>}
    </header>
  );
}
