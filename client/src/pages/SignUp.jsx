import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../features/OAuth";
import { LogIn } from "lucide-react";

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }

      setLoading(false);
      setError(null);
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(error.message)
    }

    //console.log(data);
  };

  //console.log(formData);

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign up</h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="username"
          className="border px-3 py-2 rounded-lg"
          id="username"
          onChange={handleChange}
        />

        <input
          type="email"
          placeholder="email"
          className="border px-3 py-2 rounded-lg"
          id="email"
          onChange={handleChange}
        />

        <input
          type="password"
          placeholder="password"
          className="border px-3 py-2 rounded-lg"
          id="password"
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className="bg-slate-700 text-white py-2 rounded-lg flex items-center justify-center gap-1 hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign Up"} <LogIn className="w-5 h-5" />
        </button>

        <OAuth />
      </form>

      <div className="flex gap-1 mt-5 w-max mx-auto text-sm">
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className="text-blue-700">sign in</span>
        </Link>
      </div>

     
      {error && (
        <div className="flex bg-red-100 justify-center mt-5 py-0.5 items-center">
          <p className="text-red-500  text-xs font-bold">{error}</p>
        </div>
      )}
    </div>
  );
};

export default SignUp;
