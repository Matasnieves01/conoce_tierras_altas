import type { CSSProperties, FC } from "react";

export interface IconProps {
  name: string;
  size?: number | string;
  color?: string;
  className?: string;
  style?: CSSProperties;
}

export const Icon: FC<IconProps> = ({
  name,
  size,
  color,
  className = "",
  style,
}) => {
  const customStyle: CSSProperties = {
    ...(size !== undefined
      ? { fontSize: typeof size === "number" ? `${size}px` : size }
      : {}),
    ...(color ? { color } : {}),
    ...style,
  };

  return (
    <span
      className={`material-symbols-outlined ${className}`.trim()}
      style={customStyle}
      aria-hidden="true"
    >
      {name}
    </span>
  );
};

export default Icon;
