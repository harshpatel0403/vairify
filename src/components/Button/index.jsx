function Button({
  id,
  text,
  onClick,
  className,
  size,
  bgColor,
  textClass,
  itemsStart,
  disabled,
  type,
  showFavIcon
}) {
  return (
    <button
      id={id}
      type={type || 'button'}
      className={`bg-[#E8EBF0] relative transition-all duration-300 w-full rounded-[8px] max-h-[48px] text-center py-[11px] font-roboto text-[15px] leading-[26px] font-bold primary-btn  ${className ? className : ""
        } ${size ? `h-[${size}]` : ""}  ${bgColor ? `bg-${bgColor}` : ""
        } ${itemsStart == "true" ? "items-start" : "items-center"}${showFavIcon ? 'flex justify-center gap-2' : ''}`}
      onClick={onClick}
      style={{ height: size ? `${size}` : "" }}
      disabled={disabled && disabled}
    >
      {showFavIcon && <img src={text == "Favorited" ? 'images/home/like.svg' : 'images/home/like_outline.svg'} className="h-4 w-4 absolute top-[11px] left-[20px]" />
      }
      <span className={`${textClass} whitespace-nowrap`}>{text}</span>
    </button >
  );
}

export default Button;
