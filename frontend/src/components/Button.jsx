export default function Button({
  children,
  size = "md", // sm | md | lg
  variant = "primary", // primary | outline | ghost | link(있다면)
  fullWidth = false,
  as = "button", // "button" | "a"
  to, // as="a"일 때 href
  className = "", // ⭐ 외부 className 받아서 합치기
  ...rest
}) {
  const cls = [
    "btn",
    `btn-${size}`,
    `btn-${variant}`,
    fullWidth ? "btn-block" : "",
    className, // ⭐ 전달된 클래스 합치기
  ]
    .filter(Boolean)
    .join(" ");

  if (as === "a" && to)
    return (
      <a href={to} className={cls} {...rest}>
        {children}
      </a>
    );
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
