import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/UserContext";
import uploadImage from "../../utils/uploadImage";

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);

    let profileImageUrl = "";

    if (!fullName) {
      setError("Full name is required.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setError("");

    try {
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.image.url || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        email,
        password,
        profileImageUrl,
      });

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <AuthLayout>
      <div className="w-full h-full flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-xl">
          <h3 className="text-2xl font-bold text-center text-indigo-600 mb-1">
            Create an Account
          </h3>
          <p className="text-sm text-center text-gray-600 mb-6">
            Join us today by entering your details below.
          </p>

          <form onSubmit={handleSignUp} className="space-y-5">
            <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

            <Input
              value={fullName}
              onChange={setFullName}
              label="Full Name"
              placeholder="Ankit"
              type="text"
            />
            <Input
              value={email}
              onChange={setEmail}
              label="Email Address"
              placeholder="ankit@example.com"
              type="email"
            />
            <Input
              value={password}
              onChange={setPassword}
              label="Password"
              placeholder="Min 8 characters"
              type="password"
            />

            {error && <p className="text-red-500 text-xs -mt-2">{error}</p>}

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-lg shadow-md hover:bg-indigo-700 transition-all"
            >
              SIGN UP
            </button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link className="font-medium text-indigo-600 underline" to="/login">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
