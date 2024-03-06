# [FIUBA-Plan](https://fede.dm/FIUBA-Plan/)

Organizador de horarios de la Facultad de Ingenieria

---

![](public/fplan.png)

Este proyecto apunta a una manera más facil de visualizar los horarios de cursada de la FIUBA. La idea es que no dependa de ningun servicio externo para conseguir los horarios cada cuatrimestre (porque no existe ninguno confiable que sea actualizado año a año), y los horarios sean cargados manualmente por el usuario que los puede obtener de su SIU (incluso, en una de esas funciona para SIUs de otras facultades de la UBA).

## Desarrollo

Para agregar un feature o fixear un issue hay que clonar el repositorio, instalar las dependencias con `npm install` y después correr la aplicación con `npm start`. En `localhost:3000/` va a estar corriendo la aplicación constantemente, y toda modificación que se haga al código se va a ver reflejada en la página.

Una vez terminados los cambios, con solo hacer un PR basta (porque la aplicación se compila automáticamente con cada push a master)
