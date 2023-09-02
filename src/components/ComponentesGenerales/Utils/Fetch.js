class Fetch {
    constructor(baseUrl) {
      this.baseUrl = baseUrl; // La URL base de tu backend
    }
  
    async getPuestos() {
      try {
        const response = await fetch(`${this.baseUrl}/puestos`);
        const data = await response.json();
        return data;
      } catch (error) {
        throw new Error('Error al realizar la solicitud GET a /puestos:', error);
      }
    }
  
    async getUsers() {
      try {
        const response = await fetch(`${this.baseUrl}/user`);
        const data = await response.json();
        return data;
      } catch (error) {
        throw new Error('Error al realizar la solicitud GET a /user:', error);
      }
    }
  
    // Agrega métodos adicionales para otras rutas según sea necesario
  }
  
  export default Fetch;


  /*el codigo de aca se aplicaria en los componentes
  
  import Fetch from './fetch'; // Asegúrate de que la ruta del import sea correcta

const api = new Fetch('https://tu-api-backend.com');

// Ejemplo de una solicitud GET a /puestos
api.getPuestos()
  .then(data => console.log('Respuesta GET a /puestos:', data))
  .catch(error => console.error('Error GET a /puestos:', error));

// Ejemplo de una solicitud GET a /user
api.getUsers()
  .then(data => console.log('Respuesta GET a /user:', data))
  .catch(error => console.error('Error GET a /user:', error));

// Puedes llamar a otros métodos según las rutas de tu backend*/