const CampoTexto = ({
    id,
    label,
    tipo = "text",
    valor,
    onChange,
    editable,
    opciones,
  }) => (
    <div>
      <label htmlFor={id}>{label}</label>
      {opciones ? (
        <select id={id} value={valor} onChange={onChange} disabled={!editable}>
          {opciones.map((opt) => (
            <option key={opt.id || opt.nombre} value={opt.id || opt.nombre}>
              {opt.nombre}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={tipo}
          id={id}
          value={valor}
          onChange={onChange}
          readOnly={!editable}
        />
      )}
    </div>
  );

export default CampoTexto
  