const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
  app.use(
    ["/server/authenticate", "/server/complete", "/server/game", "/server/login", "/server/logout", "/server/move", "/server/new", "/server/register", "/server/sse", "/server/user"],
    createProxyMiddleware({
      target: "http://localhost:5000",
    }));
};
