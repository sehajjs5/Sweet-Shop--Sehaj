const express = require("express");

const router = express.Router();
const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");
const {
  createSweets,
  getAllSweets,
  searchSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
} = require("../controllers/sweet.controller");

router.get("/", getAllSweets);
router.get("/search", auth, searchSweets);

router.post("/", auth, admin, createSweets);
router.put("/:id", auth, admin, updateSweet);
router.delete("/:id", auth, admin, deleteSweet);

router.post("/:id/purchase", auth, purchaseSweet);
router.post("/:id/restock", auth, admin, restockSweet);

module.exports = router;
