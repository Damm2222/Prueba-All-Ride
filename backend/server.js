const express = require("express");
const axios = require("axios");
const { Server } = require("socket.io");
const app = express();
const port = 3000;

// Clave de API de Google Maps
const apiKey = "AIzaSyDqMOAzsn3Uict0o_Ij3DsntyKmgpgbEXk";

// Iniciar el servidor HTTP
const server = app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

// Configuración para pruebas con backend
// const io = new Server(server, {
//   path: "/tech_interview",
//   cors: {
//     origin: "https://stage.allrideapp.com",
//     methods: ["GET", "POST"],
//   },
// });
/////////////
//configuracion para pruebas locales
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

  socket.on("geocodeAddress", async (address) => {
    console.log("Geocodificando dirección:", address);
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`;

    try {
      const response = await axios.get(apiUrl);
      if (response.data.status === "OK" && response.data.results.length > 0) {
        const location = response.data.results[0].geometry.location;
        socket.emit("newLocation", location);
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

  socket.on("newLocation", (coords) => {
    console.log("Coordenadas recibidas:", coords);
    if (room) {
      socket.to(room).emit("newLocation", coords);
    } else {
      socket.broadcast.emit("newLocation", coords);
    }
  });

  socket.on("disconnect", () => {
    console.log("Un usuario se ha desconectado");
  });
});
