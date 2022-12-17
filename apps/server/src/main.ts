import "dotenv/config";
import cors from "cors";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./connectDB";
import socket from "./socket";
import path from "path";
import authRoutes from "./routes/auth.routes";
import usersRoutes from "./routes/users.routes";
import requireUser from "./middleware/requireUser";
import { PORT } from "./constants";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN,
  },
});

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/api", (_req, res) => res.sendStatus(200));

app.use("/api/assets", express.static(path.join(__dirname, "./assets")));
app.use("/api/auth", authRoutes);
app.use("/api/users", requireUser, usersRoutes);

httpServer.listen(+PORT, +"0.0.0.0", async () => {
  console.log(`[server]: server is running on port http://localhost:${PORT}`);
  await connectDB();
  socket({ io });
});
