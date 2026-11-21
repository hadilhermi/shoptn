module.exports = function admin(req, res, next) {
  // req.user ji men middleware auth (JWT)
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Accès réservé aux administrateurs" });
  }
  next();
};