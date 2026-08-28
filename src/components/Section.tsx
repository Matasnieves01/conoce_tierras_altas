import type { ReactNode } from "react";

type SectionProps = {
  title?: string;
  description?: string;
  children: ReactNode;
  id?: string;
};

export const Section = ({ title, description, children, id }: SectionProps) => {
  return (
    <section id={id} className="section">
      {title && <h2 className="section__title">{title}</h2>}
      {description && <p className="section__description">{description}</p>}
      <div className="section__content">{children}</div>
    </section>
  );
};