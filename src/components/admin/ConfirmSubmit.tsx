"use client";

export function ConfirmSubmit({
  message,
  className,
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { message: string }) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
