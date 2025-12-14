const Sweet = require("../models/Sweet");

exports.createSweets = async (req, res) => {
  try {
    const { name, category, price, quantity } = req.body;
    if (!name || !category || price == null || quantity == null) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (price < 0 || quantity < 0) {
      return res
        .status(400)
        .json({ message: "Price and quantity must be non-negative" });
    }

    const newSweet = await Sweet({ name, category, price, quantity });
    await newSweet.save();
    res.status(201).json(newSweet);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getAllSweets = async (req, res) => {
  try {
    const sweets = await Sweet.find().sort({ createdAt: -1 });
    res.status(200).json(sweets);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.searchSweets = async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;
    let filter = {};

    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }
    if (category) {
      filter.category = { $regex: category, $options: "i" };
    }
    if (minPrice != null || maxPrice != null) {
      filter.price = {};
      if (minPrice != null) filter.price.$gte = Number(minPrice);
      if (maxPrice != null) filter.price.$lte = Number(maxPrice);
    }

    const sweets = await Sweet.find(filter).sort({ createdAt: -1 });
    res.status(200).json(sweets);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

//UPDATE SWEETS (ADMIN ACCESS ONLY )
exports.updateSweet = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedSweet = await Sweet.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!updatedSweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }
    res.status(200).json(updatedSweet);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.deleteSweet = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSweet = await Sweet.findByIdAndDelete(id);
    if (!deletedSweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }
    res.status(200).json({ message: "Sweet deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.purchaseSweet = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { id } = req.params;

    const sweet = await Sweet.findById(id);
    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid purchase quantity" });
    }
    if (sweet.quantity < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    sweet.quantity -= quantity;
    await sweet.save();
    res.status(200).json({ message: "Purchase successful", sweet });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
exports.restockSweet = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { id } = req.params;

    const sweet = await Sweet.findById(id);
    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid restock quantity" });
    }
    sweet.quantity = quantity;
    await sweet.save();
    res.status(200).json({ message: "Restock successful", sweet });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
