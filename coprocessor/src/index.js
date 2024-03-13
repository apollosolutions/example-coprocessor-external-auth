import express from "express";
import fetch from "node-fetch";

const app = express();

const processRouterRequestStage = async (payload) => {
  const response = await fetch("http://localhost:3005/authenticate").then((res) => res.json());

  // It's common to set scopes for use by the Router to enforce AuthZN directives
  //payload.context.entries['apollo_authentication::JWT::claims'].scope = response.scopes;

  // Add to context so it is available at subsequent stages
  payload.context.entries["authentication::authToken"] = response.token;

  return payload;
};

const processSubgraphStage = async (payload) => {
  const authToken = payload.context.entries["authentication::authToken"]; // Get the token from context

  // Most common is attaching the token to a header
  payload.headers["authToken"] = [authToken];
  // However, you could also attach it to the extensions if you have a large token that is too big for max header size
  //payload.body.extensions["authToken"] = authToken;

  return payload;
};

app.post("/", express.json(), async (req, res) => {
  const payload = req.body;

  let response = payload;
  switch (payload.stage) {
    case "SubgraphRequest":
      response = await processSubgraphStage(payload);
      break;
    case "RouterRequest":
      response = await processRouterRequestStage(payload);
      break;
  }

  res.send(response);
});

app.listen(3007, () => {
  console.log("🚀 Server running at http://localhost:3007");
});
