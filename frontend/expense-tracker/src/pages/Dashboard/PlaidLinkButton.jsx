import React, { useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import axios from "axios";

const PlaidLinkButton = ({ onSuccess }) => {
  const [linkToken, setLinkToken] = useState(null);

  // STEP 1: Get a link_token from your backend
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/v1/plaid/create-link-token")
      .then((res) => {
        setLinkToken(res.data.link_token);
      })
      .catch((err) => {
        console.error("Error creating link token", err);
        alert("Failed to create link token. Check console for details.");
      });
  }, []);

  // STEP 2: Use the link_token in Plaid Link
  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: (public_token, metadata) => {
      // STEP 3: Send public_token to backend to get access_token
      axios
        .post("http://localhost:8000/api/v1/plaid/exchange-public-token", {
          public_token,
        })
        .then((res) => {
          const accessToken = res.data.access_token;
          alert("✅ Bank account linked successfully!");
          console.log("Access Token:", accessToken);
          // Pass the access_token to the parent component
          if (onSuccess) onSuccess(accessToken);
        })
        .catch((err) => {
          console.error("Error exchanging public token", err);
          alert("Failed to link bank account. Check console for details.");
        });
    },
    onExit: (err, metadata) => {
      if (err) {
        console.error("Plaid Link exited with error:", err, metadata);
        alert("Link process exited with an error. Check console for details.");
      }
    },
  });

  return (
    <div className="flex justify-center mt-6">
      <button
        onClick={() => open()}
        disabled={!ready}
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow hover:bg-blue-700 transition duration-200"
      >
        Link Your Bank Account
      </button>
    </div>
  );
};

export default PlaidLinkButton;