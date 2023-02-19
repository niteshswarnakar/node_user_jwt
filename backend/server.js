import express from "express";
import AuthRoutes from "./routes/auth.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;

const DB_CONNECT = "mongodb+srv://user-authentication:Random4545@cluster0.nfovjvk.mongodb.net/?retryWrites=true&w=majority"


app.listen(PORT, () => console.log("server running on port ", PORT));
mongoose.connect(
  DB_CONNECT,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("connected to db");
  }
);

app.use(express.json(), cors());

app.get("/", (req, res) => {
  res.send("hey it's working");
});

app.use("/api/users", AuthRoutes);
