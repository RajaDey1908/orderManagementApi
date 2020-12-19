import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from 'http';
import config from "./config/config";
import header from "./middleware/header";
import Route from "./src/Orders/Routes";

const app = express(); // Initialize our express app

const port = process.env.PORT || 3029;

app.use(cors());
app.use("/", Route); //  Route
// app.use("/admin", AdminRoute); //Admin Route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(express.json());
app.use(header);
app.use(express.urlencoded({ extended: false }));
app.use(express.static("resources"));

global.__basedir = __dirname;

app.use((req, res, next) => {
  res.status(404).send("Page not found");
});

// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

const server = http.createServer(app);

// Mongo DB connection 
mongoose.Promise = global.Promise; // Return promise inside app
const devDbUrl = config.DATABASE_URI;
const mongoDbUrl = process.env.MONGODB_URI || devDbUrl;

mongoose.connect(mongoDbUrl,{ useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log('Mongodb Connection establish.');
  server.listen(port , () => {
    console.log(`App listening at http://localhost:${port}`);
  });
})
.catch((err) => {
  console.log('Connection Error => ',err.message);
});
