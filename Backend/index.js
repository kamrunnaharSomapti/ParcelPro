const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require('./routes/authRoutes');
const parcelRoutes = require('./routes/PercelRoutes');
const userRoutes = require('./routes/userRoutes');
const Parcel = require("./models/Parcel");
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const http = require('http');
const { Server } = require("socket.io");
dotenv.config();
const app = express();
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "PATCH", "DELETE"] }));
app.use(express.json());

// socket io
const server = http.createServer(app);
const allowedOrigins = [
    process.env.CLIENT_URL,
    "http://localhost:5173",
].filter(Boolean);
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    },
});

// io.on("connection", (socket) => {
//     console.log("Socket connected:", socket.id);

//     socket.on("join_parcel", ({ parcelId }) => {
//         socket.join(`parcel:${parcelId}`);
//     });

//     socket.on("agent_location", ({ parcelId, lat, lng }) => {
//         io.to(`parcel:${parcelId}`).emit("location_update", {
//             parcelId,
//             lat,
//             lng,
//             updatedAt: new Date().toISOString(),
//         });
//     });

//     socket.on("disconnect", () => {
//         console.log("Socket disconnected:", socket.id);
//     });
// });
// socket.js (or inside server.js where you init io)
io.on("connection", (socket) => {
    socket.on("parcel:join", ({ parcelId }) => {
        if (!parcelId) return;
        socket.join(`parcel:${parcelId}`);
    });

    socket.on("parcel:leave", ({ parcelId }) => {
        if (!parcelId) return;
        socket.leave(`parcel:${parcelId}`);
    });

    socket.on("agent:location:update", async ({ parcelId, lat, lng }) => {
        try {
            if (!parcelId || typeof lat !== "number" || typeof lng !== "number") return;

            const parcel = await Parcel.findById(parcelId);
            if (!parcel) return;


            if (!["Assigned", "Picked Up", "In Transit"].includes(parcel.status)) return;

            parcel.currentLocation = { lat, lng, updatedAt: new Date() };
            await parcel.save();

            io.to(`parcel:${parcelId}`).emit("parcel:location", {
                parcelId,
                currentLocation: parcel.currentLocation,
            });
        } catch (e) {
            console.log("agent:location:update error:", e.message);
        }
    });

    socket.on("agent:status:update", async ({ parcelId, status }) => {
        try {
            if (!parcelId || !status) return;

            const parcel = await Parcel.findById(parcelId);
            if (!parcel) return;

            parcel.status = status;
            parcel.statusHistory = parcel.statusHistory || [];
            parcel.statusHistory.push({
                status,
                by: parcel.deliveryAgent,
                at: new Date(),
            });
            await parcel.save();

            io.to(`parcel:${parcelId}`).emit("parcel:status", {
                parcelId,
                status: parcel.status,
                statusHistory: parcel.statusHistory,
            });
        } catch (e) {
            console.log("agent:status:update error:", e.message);
        }
    });
    socket.on("connect_error", (err) => {
        console.log("socket connect_error:", err.message);
    });
});


// middlewares

app.use('/api/auth', authRoutes);
app.use('/api/parcels', parcelRoutes);
app.use('/api/users', userRoutes);

// db connection
const DB = process.env.DB
mongoose.connect(DB).then(() => {
    console.log("DB connected")
}).catch((err) => {
    console.log("DB connection error", err)
})
// swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Courier API',
            version: '1.0.0',
        },
        servers: [{ url: `http://localhost:${process.env.PORT || 8000}/api` }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    // Use an absolute path to avoid "No operations defined"
    apis: [`${path.join(__dirname, './routes/*.js')}`],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
console.log(swaggerDocs);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// server
const PORT = process.env.PORT || 8000
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
