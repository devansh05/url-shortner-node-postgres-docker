import express from "express";
const PORT = 3000;
const app = express();



app.get("/", (req, res, next) => {
  res.send("INITIATED AND RUNNING.");
});

app.listen(PORT, () => console.log(`🟡 LOG - LISTENING ON PORT : `, PORT));
