import express from "express";

const app = express();

app.get("/authenticate", (req, res) => {
  // This is just an example for the purposes of having something that the coprocessor can call.
  res.send({ scopes: ["profile"], token: "ABC123" });
});

app.listen(3005, () => {
  console.log("🚀 Server running at http://localhost:3005");
});
