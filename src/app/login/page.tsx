"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useAuthStore } from "@/lib/useAuthStore";

export default function LoginPage() {
    const router = useRouter();
    const setUser = useAuthStore((state)=>state.setUser)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    // const [successor, setSuccessor] = useState(false);


    const handleSubmit = async (e: React.FormEvent) => {
        setLoading(true);
        e.preventDefault();
        try {
           const apiRequest = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", 
        body: JSON.stringify({
          email,
          password,
        }),
      });

            const response = await apiRequest.json();
            if (apiRequest.ok) {
                setUser(response.user)
                console.log("Login SuccessFully", response)
                setLoading(false);
                alert("Login Successful");
                router.push("/dashboard");
                router.refresh()
            } else {
                alert(response.message);
                setLoading(false);
            }
        } catch (error) {
            alert("Error Occur")
                setLoading(false);
        }

    }

    return (
        <>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    Welcome Back 👋
                </h1>
                <p className="text-center text-gray-500 mb-8 text-sm">
                    Login to access your dashboard
                </p>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="you@example.com"
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gray-800 hover:bg-gray-900 text-white py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200"
                    >
                        {loading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                        ) : (
                            <>
                                <LogIn size={18} /> Login
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    © {new Date().getFullYear()} TeamFlow AI
                </p>
            </div>
        </div>


        </>
    );
}
