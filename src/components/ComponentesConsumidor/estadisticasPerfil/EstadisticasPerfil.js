import { useEffect, useContext, useState } from "react";
import { UserContext } from "../../ComponentesGenerales/UserContext";
import CardGenericaEstadistica from "./CardGenericaEstadistica";

const EstadisticasPerfil = () => {
  const { user } = useContext(UserContext);
  const [estadisticasConsumidor, setEstadisticasConsumidor] = useState(null);
  const [estadisticasRepartidor, setEstadisticasRepartidor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        let dataRepartidor = null;
        let dataConsumidor = null;

        if (user.tipoUsuario === "repartidor") {
          const responseRepartidor = await fetch(
            `${process.env?.REACT_APP_BACK_URL}estadisticas/repartidor/${user.consumidorId}`
          );
          if (!responseRepartidor.ok)
            throw new Error("Error en la API de repartidor");
          dataRepartidor = await responseRepartidor.json();
        }

        const responseConsumidor = await fetch(
          `${process.env?.REACT_APP_BACK_URL}estadisticas/consumidor/${user.consumidorId}`
        );
        if (!responseConsumidor.ok)
          throw new Error("Error en la API de consumidor");
        dataConsumidor = await responseConsumidor.json();

        setEstadisticasRepartidor(dataRepartidor?.data || null);
        setEstadisticasConsumidor(dataConsumidor?.data || null);
      } catch (error) {
        console.error("Error al obtener estadísticas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) fetchEstadisticas();
  }, [user]);

  if (isLoading) return <p>Cargando estadísticas...</p>;

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {user.tipoUsuario === "repartidor" && (
        <CardGenericaEstadistica
          titulo={"Eventos Trabajados"}
          valor={estadisticasRepartidor.eventos_participados}
        />
      )}
      {user.tipoUsuario === "repartidor" && (
        <CardGenericaEstadistica
          titulo={"Pedidos Entregados"}
          valor={estadisticasRepartidor.pedidos_entregados}
        />
      )}
      <CardGenericaEstadistica
        titulo={"Total Gastado"}
        valor={estadisticasConsumidor.total_gastado}
      />
      <CardGenericaEstadistica
        titulo={"Pedidos Realizados"}
        valor={estadisticasConsumidor.total_pedidos}
      />
      <CardGenericaEstadistica
        titulo={"Eventos Participados"}
        valor={estadisticasConsumidor.total_eventos}
      />
    </div>
  );
};

export default EstadisticasPerfil;
