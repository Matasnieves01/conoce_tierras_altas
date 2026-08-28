type HeadingProps = {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
};

const Heading = ({ title, subtitle, align = "left" }: HeadingProps) => {
  return (
    <div className={`heading heading--${align}`}>
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
};

export default Heading;