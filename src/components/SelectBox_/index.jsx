import React from "react";

const SelectBox_ = ({
  className,
  options,
  onChange,
  borderWidth,
  arrowColor,
  iconColor,
  customization,
  className2,
  setRules,
  value,
  border,
  optionClass
}) => {
  return (
    <select
      onChange={onChange}
      value={value}
      className={` ${className}`}
      style={{ borderColor: border && border }}
    >
      {options.map((option) => (
        <option key={option} value={option} className={` ${optionClass} text-black`}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default SelectBox_;
