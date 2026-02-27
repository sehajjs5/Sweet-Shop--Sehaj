import { useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";
import { useState } from "react";
export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Login started");
      await login(email, password);
      console.log("Login successful");
      window.location.href = "/";
    } catch {
      setError("Failed to login. Please check your credentials.");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="shadow border rounded-xl font-primary max-w-md p-6 space-y-4">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl mb-4 p-6">Login</h2>
          {error && <p className="text-red-500">{error}</p>}
          <input
            type="email"
            placeholder="Email"
            className="border p-6 w-full mb-4 rounded-xl"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-6 w-full mb-4 rounded-xl"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <button
            type="submit"
            className="bg-black text-white p-4 rounded-xl w-full cursor-pointer hover:bg-gray-900"
          >
            Login
          </button>
        </form>
        <div className="flex justify-center">
          <p>New User? </p>
          <button
            onClick={() => navigate("/register")}
            className="cursor-pointer text-blue-500 ml-2"
          >
            Register Now
          </button>
        </div>
      </div>
    </div>
  );
}
