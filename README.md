# External Authenticating using a Coprocessor

This repository demonstrates how to setup a coprocessor with the Router to do external authentication. This can be used for service-to-service authentication, for populating claims based on an opaque token, enriching a JWT with additional scopes, etc.

## Running the Example

> Note: To run this example, you will need a GraphOS Enterprise plan and must create `/router/.env` based on `/router/.env.example` which exports `APOLLO_KEY` and `APOLLO_GRAPH_REF`.

1. Run the subgraph from the `/subgraph` directory with `npm run dev`
1. Run the auth-service from the `/auth-service` directory with `npm run dev`
1. Run the coprocessor from the `/coprocessor` directory with `npm run dev`
1. In the `/router` directory, download the router by running `./download_router.sh`
1. In the `/router` directory, compose the schema by running `./create_local_schema.sh`
1. In the `/router` directory, run the router by running `./start_router.sh`

Now if you run this code in the browser (http://127.0.0.1:4000/), you will be able to query the router.

## Code Highlights

### Coprocessor Configuration

In `router/router-config.yaml`, the coprocessor is configured with the Router to be called for all subgraphs on the `subgraph` and `router` `request` stages.

### Coprocessor

In `coprocessor/src/index.js`, the coprocessor is setup with `express` to listen to the `/` POST endpoint and respond to the `SubgraphRequest` or `RouterRequest` stages.

In the `processRouterRequestStage` function, an external service is called and the resulting token is stored in the Router context value `authentication::authToken`.

In the `processSubgraphStage` function, the `authentication::authToken` context value is retrieved and attached to the outgoing headers.

Note that this also demonstrates how to attach claims for authZN directives and how to attach a larger token to the `body.extensions` instead of a header.

### Subgraph

In `subgraph/src/index.js`, it is demonstrated how to extract the `authToken` in the subgraph from either the `headers` or the `body.extensions`.
