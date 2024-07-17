import express from "express";
import mongoose from "mongoose";
import router from "./route/route.js";
import config from "./config/config.js";
import cors from "cors";

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.use(cors());

// parse application/x-www-form-urlencoded   middleware

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", router);

const port = config.port || process.env.PORT || 9000;

app.get("*", (req, res) => {
  res.send("<h2> Page not found</h2>");
});

app.listen(port, () => {
  mongoose
    .connect("mongodb://localhost:27017/suppermarketplusdb", {
      useNewUrlParser: true,

      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("mongodb connect");
    })
    .catch((err) => {
      console.log(err);
    });
  console.log(`app listening on port ${port}`);
});
