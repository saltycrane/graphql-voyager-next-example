const express = require("express");
const voyager = require("graphql-voyager/middleware");
const proxyMiddleware = require("http-proxy-middleware");
const next = require("next");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(
    proxyMiddleware("/graphql", {
      target: process.env.GRAPHQL_API,
      pathRewrite: { "^/graphql": "" },
      changeOrigin: true,
    }),
  );

  server.use("/voyager", voyager.express({ endpointUrl: "/graphql" }));

  server.get("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
