const CardGenericaEstadistica = ({titulo,valor}) => {
  return (
    <div>
      <h2>{titulo}</h2>
      <h3 style={{textAlign:"center"}}>{valor}</h3>
    </div>
  );
};

export default CardGenericaEstadistica;
