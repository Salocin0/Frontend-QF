export const EditableInput = ({
    label,
    value,
    onChange,
    readOnly,
    disabled,
    required,
    id,
    type = "text",
  }) => (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        disabled={disabled}
        required={required}
      />
    </div>
  );