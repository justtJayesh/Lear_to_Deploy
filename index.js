const express = require("express");
const { connection } = require("./config/db");
const { userRouter } = require("./routes/User.route");
const { noteRouter } = require("./routes/Note.route");
const { auth } = require("./middleware/auth.middleware");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/users", userRouter);

app.use(auth);
app.use("/notes", noteRouter);

app.listen(process.env.port, async () => {
    try {
        await connection;
        console.log("Connected to DB");
    } catch (error) {
        console.log(err);
        console.log("Something went wrong");
    }
    console.log(`Server is running ${process.env.port}..`);
});
