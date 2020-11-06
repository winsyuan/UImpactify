const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();

app.use(cors());
// app.use(express.static('uploads'))
app.set("view engine", "ejs");
app.use(express.json());

/* Mongoose Connection */

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB connected!");
});

const courseRouter = require("./routes/course");
const userRouter = require("./routes/user");
// const chatRouter = require("./routes/chat");

// app.use("/chat", chatRouter);
app.use("/course", courseRouter);
app.use("/user", userRouter);

const server = require("http").createServer(app);

const io = require("socket.io")(server, {
  origins: ["http://localhost:*", "http://127.0.0.1:*"],
});

io.on("connection", (socket) => {
  console.log("connected");
  socket.on("message", (data) => console.log(data));
});

server.listen(8000);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});
