import { useState } from "react";
import useAuth from "../context/useAuth";
import { useNavigate } from "react-router-dom";
export default function Register() {
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, email, password);
      navigate("/login", { replace: true });
    } catch {
      setError("Failed to register. Please try again.");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="shadow border rounded-xl font-primary max-w-md p-6 space-y-4">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl mb-4">Register</h2>
          {error && <p className="text-red-500">{error}</p>}
          <input
            type="text"
            placeholder="username"
            className="border p-2 w-full mb-4 rounded-xl"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
          <input
            type="email"
            placeholder="Email"
            className="border p-2 w-full mb-4 rounded-xl"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2 w-full mb-4 rounded-xl"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <button
            type="submit"
            className="bg-black text-white p-4 rounded-xl w-full cursor-pointer hover:bg-gray-900"
          >
            Register
          </button>
        </form>
        <div className="flex justify-center">
          <p>Already a user? </p>
          <button
            onClick={() => navigate("/login")}
            className="cursor-pointer text-blue-500 ml-2"
          >
            Login Now
          </button>
        </div>
      </div>
    </div>
  );
}
