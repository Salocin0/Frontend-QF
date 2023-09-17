class Fetch {
  constructor(baseUrl) {
      this.baseUrl = baseUrl;
  }

  async getPuestos(consumidorId) {
    try {
      const headers = new Headers();
      headers.append("ConsumidorId", consumidorId);
      const response = await fetch(`${this.baseUrl}/puestos`,{headers: headers});
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error("Error al realizar la solicitud GET a /puestos:", error);
    }
  }

  async getUsers() {
    try {
      const response = await fetch(`${this.baseUrl}/user`);
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error("Error al realizar la solicitud GET a /user:", error);
    }
  }

  async deletePuesto(id, consumidorId) {
    try {
      const headers = new Headers();
      headers.append("ConsumidorId", consumidorId);
      const response = await fetch(`${this.baseUrl}/puesto/${id}`, {
        method: "DELETE",
        headers: headers,
      });
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(
        "Error al realizar la solicitud Delete a /puesto/${id} ",
        error
      );
    }
  }

  async getDataSession(sessionId) {
    try {
      const response = await fetch(`${this.baseUrl}/user/session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionID: sessionId }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(
        "Error al realizar la solicitud Post a /user/session para obtener la sesion",
        error
      );
    }
  }

  async getProvincias() {
    try {
      const response = await fetch(
        "https://apis.datos.gob.ar/georef/api/provincias"
      );
      const data = await response.json();
      return data.provincias;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getLocalidadesByProvincia(provincia) {
    try {
      const response = await fetch(
        `https://apis.datos.gob.ar/georef/api/municipios?provincia=${provincia}&campos=id,nombre&max=700`
      );
      const data = await response.json();
      const sortedLocalidades = data.municipios.sort((a, b) =>
        a.nombre.localeCompare(b.nombre)
      );
      return sortedLocalidades;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default Fetch;
