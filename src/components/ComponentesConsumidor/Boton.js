const Boton = ({ texto, onClick, estilo = {} }) => (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "8px 16px",
        marginRight: "8px",
        borderRadius: "4px",
        border: "1px solid #ccc",
        cursor: "pointer",
        ...estilo,
      }}
    >
      {texto}
    </button>
  );

  export default Boton;