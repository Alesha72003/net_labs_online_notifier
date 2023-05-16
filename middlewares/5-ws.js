const expressWs = require('express-ws');
const passport = require("passport");

let handlers = [];
let sessions = {};

module.exports = (app) => {
  expressWs(app);

  app.ws("/ws", (ws, req) => {
    if (!req.user) {
      ws.close()
      return
    }
    if (!sessions[req.user.id]) {
      sessions[req.user.id] = new Set()
    }
    sessions[req.user.id].add(ws);
    ws.req = req;
    handlers.filter(el => el.type != "logout").forEach(el => {
      ws.on(el.type, (e) => el.f(ws, e));
    })
  })

  app.use((req, res, next) => {
    req.ws = sessions[req.user.id];
    next();
  })
};

module.exports.on = (type, f) => {
  handlers.push({type, f});
}

module.exports.on("close", (ws) => {
  console.log("Websocket closed")
  sessions[ws.req.user.id].delete(ws)
})

module.exports.sessions = sessions;

// module.exports.on("message", (ws, e) => {
//   ws.req.session.reload((e) => { 
//     console.log(e)
//     if (e) {
//       ws.req.user = null;
//       ws.close();
//     }
//   })
// })