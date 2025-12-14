import useAuth from "../context/useAuth";
import api from "../api/axios";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = user?.role === "ADMIN";
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchCategory, setSearchCategory] = useState("");

  const applySearch = async () => {
    try {
      const res = await api.get("/sweets/search", {
        params: {
          name: searchName || undefined,
          category: searchCategory || undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
        },
      });
      setSweets(res.data);
    } catch {
      alert("Search failed");
    }
  };
  const resetSearch = () => {
    setSearchName("");
    setSearchCategory("");
    setMinPrice("");
    setMaxPrice("");
    fetchSweets();
  };

  const fetchSweets = async () => {
    try {
      const res = await api.get("/sweets");
      setSweets(res.data);
    } catch (error) {
      console.error("Failed to fetch sweets:", error);
    } finally {
      setLoading(false);
    }
  };

  const purchaseSweet = async (sweet) => {
    const input = prompt(
      `Enter quantity to purchase (Available: ${sweet.quantity})`
    );

    // User cancelled
    if (input === null) return;

    const quantity = Number(input);

    // Validation
    if (isNaN(quantity) || quantity <= 0) {
      alert("Please enter a valid quantity");
      return;
    }

    if (quantity > sweet.quantity) {
      alert("Quantity exceeds available stock");
      return;
    }
    try {
      await api.post(`/sweets/${sweet._id}/purchase/`, { quantity });
      alert(`Order placed successfully! (${quantity} item(s))`);
      fetchSweets();
    } catch (error) {
      console.error("Failed to purchase sweet:", error);
    }
  };

  const deleteSweet = async (id) => {
    if (!confirm("Delete this sweet?")) return;

    try {
      await api.delete(`/sweets/${id}`);
      fetchSweets();
    } catch {
      alert("Delete failed");
    }
  };

  const restockSweet = async (id) => {
    const qty = prompt("Enter restock quantity");
    if (!qty) return;

    try {
      await api.post(`/sweets/${id}/restock`, {
        quantity: Number(qty),
      });
      fetchSweets();
    } catch {
      alert("Restock failed");
    }
  };

  const handleAddSweet = async (e) => {
    e.preventDefault();

    try {
      await api.post("/sweets", {
        name,
        category,
        price: Number(price),
        quantity: Number(qty),
      });
      setShowAdd(false);
      fetchSweets();
    } catch {
      alert("Failed to add sweet");
    }
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  if (loading) {
    return <div className="text-center text-2xl">Loading...</div>;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sweet Shop</h1>
        {isAdmin && (
          <button
            onClick={() => setShowAdd(true)}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Add Sweet
          </button>
        )}

        {showAdd && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <form
              onSubmit={handleAddSweet}
              className="bg-white p-6 rounded space-y-3"
            >
              <input
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
              />
              <input
                placeholder="Category"
                onChange={(e) => setCategory(e.target.value)}
              />
              <input
                placeholder="Price"
                type="number"
                onChange={(e) => setPrice(e.target.value)}
              />
              <input
                placeholder="Quantity"
                type="number"
                onChange={(e) => setQty(e.target.value)}
              />

              <button className="bg-green-500 text-white px-4 py-2">Add</button>
            </form>
          </div>
        )}

        <div className="flex items-center gap-4">
          <span>{user?.name}</span>
          <button
            onClick={logout}
            className="bg-black text-white p-4 rounded-xl cursor-pointer hover:bg-gray-900"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-5 gap-3">
        <input
          type="text"
          placeholder="Search name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Min price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border p-2 rounded"
        />

        <div className="flex gap-2">
          <button
            onClick={applySearch}
            className="bg-blue-600 text-white px-3 py-2 rounded"
          >
            Search
          </button>
          <button
            onClick={resetSearch}
            className="bg-gray-400 text-white px-3 py-2 rounded"
          >
            Reset
          </button>
        </div>
      </div>
      {/* Sweet Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {sweets.map((sweet) => (
          <div
            key={sweet._id}
            className="border rounded p-4 flex flex-col justify-between cursor-pointer"
          >
            <div>
              <h2 className="text-lg font-semibold">{sweet.name}</h2>
              <p className="text-sm text-gray-600">{sweet.category}</p>
              <p className="mt-2">₹ {sweet.price}</p>
              <p className="text-sm">Stock: {sweet.quantity}</p>
            </div>

            <button
              disabled={sweet.quantity === 0}
              onClick={() => purchaseSweet(sweet)}
              className={`mt-4 py-2 rounded ${
                sweet.quantity === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 text-white"
              }`}
            >
              {sweet.quantity === 0 ? "Out of Stock" : "Purchase"}
            </button>
            {isAdmin && (
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => deleteSweet(sweet._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>

                <button
                  onClick={() => restockSweet(sweet._id)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Restock
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
