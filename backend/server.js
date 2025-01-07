const express = require("express");
const axios = require("axios");
const { Server } = require("socket.io");
const app = express();
const port = 3000;

// Clave de API de Google Maps (directa, para pruebas)
const apiKey = "AIzaSyDqMOAzsn3Uict0o_Ij3DsntyKmgpgbEXk"; // REEMPLAZA con tu clave real

// Iniciar el servidor HTTP
const server = app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

// Configuración de Socket.io con la ruta '/tech_interview'
// const io = new Server(server, {
//   path: "/tech_interview",
//   cors: {
//     origin: "https://stage.allrideapp.com",
//     methods: ["GET", "POST"],
//   },
// });
const io = new Server(server, {
  path: "/tech_interview",
  cors: {
    origin: "http://localhost:4200", // Cambia a localhost para pruebas locales
    methods: ["GET", "POST"],
  },
});

app.use(express.json());

// Manejo de conexiones de Socket.io
io.on("connection", (socket) => {
  console.log("Un usuario se ha conectado uwu");

  const room = socket.handshake.query.room;
  if (room) {
    socket.join(room);
    console.log(`Usuario unido a la sala: ${room}`);
  }

  // Manejar el evento 'geocodeAddress'
  socket.on("geocodeAddress", async (address) => {
    console.log("Geocodificando dirección:", address);
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`;

    try {
      const response = await axios.get(apiUrl);
      if (response.data.status === "OK" && response.data.results.length > 0) {
        const location = response.data.results[0].geometry.location;
        // Emitir 'newLocation' al cliente que emitió la solicitud
        socket.emit("newLocation", location);
        // Emitir 'newLocation' a otros clientes en la misma sala
        socket.to(room).emit("newLocation", location);
        console.log("Coordenadas emitidas:", location);
      } else {
        socket.emit(
          "error",
          "No se encontraron resultados para la dirección ingresada."
        );
      }
    } catch (error) {
      console.error("Error en la solicitud de geocodificación:", error);
      socket.emit(
        "error",
        "Ha ocurrido un error en la geocodificación. Por favor, intenta nuevamente."
      );
    }
  });

  // Manejar el evento 'newLocation' si decides permitir que los clientes emitan directamente
  socket.on("newLocation", (coords) => {
    console.log("Coordenadas recibidas:", coords);
    if (room) {
      // Emitir a todos los clientes en la misma sala excepto al que emitió
      socket.to(room).emit("newLocation", coords);
    } else {
      // Emitir a todos los clientes excepto al que emitió
      socket.broadcast.emit("newLocation", coords);
    }
  });

  socket.on("disconnect", () => {
    console.log("Un usuario se ha desconectado");
  });
});
