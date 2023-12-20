import express from "express";
import router from "./routes/event.route.js";
import { ValidationError } from "express-validation";

const app = express();
const PORT = 5000;

app.use(express.json());
app.use("/api", router);
app.use(function (err, req, res, next) {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err);
  }
  return res.status(500).json(err);
});

app.listen(PORT, () => {
  console.log(`Test app listening on port ${PORT}`);
});
