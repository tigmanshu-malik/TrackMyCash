import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from 'react-router-dom';
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/UserContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const { updateUser } = useContext(UserContext);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setError("Please enter a valid email address:");
            return;
        }

        if (!password) {
            setError("Please enter a password");
            return;
        }

        setError("");

        try {
            const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
                email,
                password,
            });

            const { token, user } = response.data;

            if (token) {
                localStorage.setItem("token", token);
                // updateUser(user);
                navigate("/dashboard");
            }
        } catch (error) {
            if (error.response && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("Something Went Wrong. Please Try Again");
            }
        }
    };

    return (
        <AuthLayout>
            <div className="lg:w-[70%] max-w-md mx-auto bg-white p-8 shadow-lg rounded-xl">
                <h3 className="text-2xl font-bold text-center text-indigo-600 mb-1">Welcome Back 👋</h3>
                <p className="text-sm text-center text-gray-600 mb-6">
                    Please enter your credentials to log in to your account.
                </p>

                <form onSubmit={handleLogin} className="space-y-5">
                    <Input
                        value={email}
                        onChange={setEmail}
                        label="Email Address"
                        placeholder="ankit@example.com"
                        type="text"
                    />
                    <Input
                        value={password}
                        onChange={setPassword}
                        label="Password"
                        placeholder="Min 8 characters required"
                        type="password"
                    />

                    {error && <p className="text-red-500 text-xs -mt-2">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-lg shadow-md hover:bg-indigo-700 transition-all"
                    >
                        {isLoading ? "Logging in..." : "LOGIN"}
                    </button>

                    <p className="text-center text-sm text-gray-600">
                        Don’t have an account?{" "}
                        <Link className="font-medium text-indigo-600 underline" to="/signup">
                            Sign Up
                        </Link>
                    </p>
                </form>
            </div>
        </AuthLayout>
    );
};

export default Login;
