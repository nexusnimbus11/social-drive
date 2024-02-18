import express from "express";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.all("*", (req, res) => {
  return res.sendStatus(404);
});

export default app;
