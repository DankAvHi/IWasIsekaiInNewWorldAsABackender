export type TypographyProps = {
  children?: React.ReactNode | string;
  className?: string;
  TextComponent?: React.ElementType;
  attributes?: Record<string, unknown>;
};

export const Typography: React.FC<TypographyProps> = ({
  children,
  className,
  TextComponent = "p",
  attributes,
}) => {
  return (
    <TextComponent {...attributes} className={`${className}`}>
      {children}
    </TextComponent>
  );
};
