const express = require("express");
const { register, login } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
const authMiddleware = require("../middleware/auth.middleware");
router.get("/me", authMiddleware, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      role: req.user.role,
    },
  });
});
module.exports = router;
