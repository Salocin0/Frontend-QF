# DOCUMENTACIÓN
Descripción de la aplicación
La aplicación fue generada para el curso de "React JS" de Coderhouse, la misma se base en  un e-commerce el cual contará con una seríe de productos directamente cargados en Firebase estos incluyen un título, un precio, una categoria, una descripción, entre otros atributos.La aplicación permite al usuario seleccionar diferentes categoría "Hombres" "Mujeres" "Electronicos" "Joyería" el usuario podrá ingresar a cada uno de los productos para obtener más información sobre el mismo para luego en caso de desearlos poder comprarlos, para eso el usuario debe ingresar al producto seleccionar una cantidad, esta cantidad se verá reflejada en el carrito. Una vez en el carrito, en caso de arrepetinse el usuario podría modificar la cantidad y confirmar la compra. Para confirmar la compra debe llenar una serie de datos personales, si la compra se genero exitosamente se le mostrará al usuario la noticación correspondiente y se le proporcionara la id de compra generada automaticamente por Firebase.

# CONSIDERACIONES
ItemCount será el encargado de confirmar la cantidad inicial del producto y pasar la misma al carrito, esto se determinó así ya que al realizar la programación he comenzado a implementar la lógica en ItemCount y si mi entendimiento es correcto el profesor comentó que esta lógica podría ser realizada por ItemCount y sería válido, aunque quizás no sea la mejor opción.

Cada producto almacenado en Firebase cuenta con un stock de 999. El control de stock queda fuera del dominio de la aplicación y por cuestiones prácticas y de prueba no se realiza la modificación sobre la cantidad en la base.

# USO E INSTALACIÓN

Para usar la aplicación, se deberá descargar el código fuente desde el repositorio de GitHub. Luego, se deberá instalar las dependencias necesarias con el comando "npm install" o "yarn install". Una vez instalado todo lo necesario, se puede iniciar el proyecto con el comando "npm start" o "yarn start". Por último, para abrir la aplicación desde tu navegador,se tiene que acceder a http://localhost:3000. 

# TECNOLOGIAS

Para el desarrollo de la aplicación se utilizaron las siguientes tecnologías

React: es una herramienta para el desarrollo de aplicaciones web que nos permite controlar el estado y los efectos de la aplicación. Con React, podemos construir interfaces de usuario interactivas y escalables.

Firebase: es una plataforma que ofrece diversas herramientas y servicios para el desarrollo de aplicaciones web y móviles. En este proyecto, se utilizó su base de datos para conectarla con la aplicación, lo que permitió almacenar y consultar información en tiempo real.

React-toastify: se utilizó para mostrar todas las notificaciones de la aplicación, tales como mensajes de éxito, error, informativos, etc. Esta dependencia proporciona una forma sencilla de mostrar mensajes de una manera atractiva y personalizable.

React-router-dom: es una dependencia que permite implementar el enrutamiento en aplicaciones web construidas con React. Se utilizaron componentes como Route, Link y BrowserRouter para definir las rutas de la aplicación y controlar la visualización de diferentes componentes en función de la URL actual.

React-scripts: es un conjunto de scripts y configuraciones preestablecidas para el desarrollo de aplicaciones web con React. React-scripts incluye tareas como la compilación, pruebas unitarias, optimización de recursos y despliegue en producción, lo que facilita el desarrollo y la distribución de la aplicación.

Bootstrap y React-bootstrap: Bootstrap es un framework de diseño web que proporciona componentes predefinidos y estilos para facilitar la creación de aplicaciones web modernas y responsivas. React-bootstrap es una versión de Bootstrap diseñada para ser utilizada con React, lo que permite aprovechar todas las ventajas de Bootstrap en el desarrollo de aplicaciones con React.

React-dom: es una biblioteca que se usa para permitir la representación de componentes de React en el DOM. React-dom renderiza los componentes de React en el navegador y permite interactuar con ellos a través de eventos y propiedades.

# VERCEL

La aplicación fue desplegada en la plataforma de alojamiento web Vercel de forma gratuita.
El link para ingresar a la aplicación mediante vercel es el siguiente:
https://entrega-final-react-nine.vercel.app/

