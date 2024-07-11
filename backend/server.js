require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
const requestIp = require("request-ip");
app.use(
  requestIp.mw({
    attributeName: "clientIp",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const connectDB = require("./db/connection");
connectDB(process.env.MONGO_URL)
  .then(() => {
    const port = process.env.PORT;
    app.listen(port, () => {
      console.log("DB connected Successfully and server started at " + port);
    });
  })
  .catch((err) => {
    console.log("error occurred");
    console.log(err);
  });

const urlRoute = require("./routes/url.routes");
const userRoute = require("./routes/user.routes");
const paymentRoute = require("./routes/payment.routes");
const { handleGetRedirectURL } = require("./controllers/url.controller");

app.use("/api/url", urlRoute);
app.use("/user", userRoute);
app.use("/api/payment", paymentRoute);
app.get("/:id", handleGetRedirectURL);
