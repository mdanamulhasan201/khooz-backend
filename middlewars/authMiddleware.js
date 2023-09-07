// user request access data or not access data define this middleware (access data)
const jwt = require("jsonwebtoken");

module.exports.authMiddleware = async (req, res, next) => {
  // 1st cookie get in browser
  const { accessToken } = req.cookies;
  if (!accessToken) {
    return res.status(409).json({ error: "Please login first" }); //if not access token available then alert this message
  } else {
    //if available access token then (decode token)
    try {
      // using try catch because token sometime expired (so we catch error)
      const deCodeToken = await jwt.verify(accessToken, process.env.SECRET); //decode token
      req.role = deCodeToken.role;
      req.id = deCodeToken.id;
      next();
    } catch (error) {
      return res.status(409).json({ error: "Please login " }); //time expired expires your token
    }
  }
};
