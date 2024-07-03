import express from "express";
import mongoose from "mongoose";
import router from "./route/route.js";

const app = express();

// parse application/x-www-form-urlencoded   middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", router);

const port = process.env.PORT || 9000;

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
