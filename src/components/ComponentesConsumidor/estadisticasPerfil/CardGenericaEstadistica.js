const CardGenericaEstadistica = ({titulo,valor}) => {
  return (
    <div>
      <h2 style={{textAlign:"center",fontSize:"1.6rem"}}>{titulo}</h2>
      <h3 style={{textAlign:"center",fontSize:"1.2rem"}}>{valor}</h3>
    </div>
  );
};

export default CardGenericaEstadistica;
