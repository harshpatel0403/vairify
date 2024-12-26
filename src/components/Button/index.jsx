function Button({
  id,
  text,
  onClick,
  className,
  size,
  bgColor,
  itemsStart,
  disabled,
  type
}) {
  return (
    <button
      id={id}
      type={type || 'button'}
      className={`bg-gradient-to-b w-full rounded-[10px] text-center  ${
        className ? className : ""
      } ${size ? `h-[${size}]` : "h-[50px] hover:bg-blue-700"}  ${
        bgColor ? `bg-${bgColor}` : "bg-[#05B7FD]"
      } ${itemsStart == "true" ? "items-start" : "items-center"}`}
      onClick={onClick}
      style={{ height: size ? `${size}` : "" }}
      disabled={disabled && disabled}
    >
      {text}
    </button>
  );
}

export default Button;
