import useAuth from "../context/useAuth";
import api from "../api/axios";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = user?.role === "ADMIN";
  const isUser = user?.role === "USER";
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [editingSweet, setEditingSweet] = useState(null);
  const [newPrice, setNewPrice] = useState("");

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
  const updatePrice = async () => {
    if (!newPrice || isNaN(newPrice) || Number(newPrice) <= 0) {
      alert("Enter valid price");
      return;
    }
    try {
      await api.put(`/sweets/${editingSweet._id}`, { price: Number(newPrice) });
      setEditingSweet(null);
      fetchSweets();
      alert("Price updated successfully");
    } catch {
      alert("Update failed");
    }
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
    const qty = prompt("Enter new stock quantity");
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
    <div className="p-6 ">
      {/* Header */}
      <div className="flex justify-between items-center mb-6  shadow p-4 rounded">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-fuchsia-400 to-purple-800 bg-clip-text text-transparent">
          AI Kata Sweet Shop by Sehaj
        </h1>
        {isAdmin && (
          <button
            onClick={() => setShowAdd(true)}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
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

              <button className="bg-green-500 text-white px-4 py-2 hover:bg-green-700 transition">
                Add
              </button>
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
      <div className=" p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-5 gap-3">
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
            className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition"
          >
            Search
          </button>
          <button
            onClick={resetSearch}
            className="bg-gray-400 text-white px-3 py-2 rounded hover:bg-gray-700 transition"
          >
            Reset
          </button>
        </div>
      </div>
      {/* Sweet Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ">
        {sweets.map((sweet) => (
          <div
            key={sweet._id}
            className="border rounded-lg p-4 flex flex-col justify-between cursor-pointer shadow-md hover:shadow-lg transition"
          >
            <div>
              <h2 className="text-lg font-semibold">{sweet.name}</h2>
              <p className="inline-block bg-gray-200 text-xs px-2 py-1 rounded mb-2">
                {sweet.category}
              </p>
              <p className="mt-2">₹ {sweet.price}</p>
              {isAdmin && (
                <p
                  className={`text-md font-medium ${
                    sweet.quantity === 0
                      ? "text-red-500"
                      : sweet.quantity < 200
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                >
                  Stock: {sweet.quantity}
                </p>
              )}
            </div>
            {isUser && (
              <button
                disabled={sweet.quantity === 0}
                onClick={() => purchaseSweet(sweet)}
                className={`mt-4 py-2 rounded ${
                  sweet.quantity === 0
                    ? "bg-gray-400 cursor-not-allowed hover:unset"
                    : "bg-green-600 text-white hover:bg-green-700 transition"
                }`}
              >
                {sweet.quantity === 0 ? "Out of Stock" : "Purchase"}
              </button>
            )}

            {isAdmin && (
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => {
                    setEditingSweet(sweet);
                    setNewPrice(sweet.price);
                  }}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                >
                  Edit Price
                </button>

                <button
                  onClick={() => deleteSweet(sweet._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>

                <button
                  onClick={() => restockSweet(sweet._id)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-700 transition"
                >
                  Restock
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {editingSweet && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-80 space-y-4">
            <h2 className="text-lg font-semibold">
              Edit Price – {editingSweet.name}
            </h2>

            <input
              type="number"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="border p-2 w-full rounded"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingSweet(null)}
                className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-700 transition"
              >
                Cancel
              </button>

              <button
                onClick={updatePrice}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-300 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
