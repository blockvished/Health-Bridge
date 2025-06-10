"use client";
import Cookies from "js-cookie";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PayoutForm = () => {
  const [fullName, setFullName] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [upiId, setUpiId] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const idFromCookie = Cookies.get("userId");
    console.log("UserId from cookie:", idFromCookie);
    setUserId(idFromCookie || null);
  }, []);

  useEffect(() => {
    if (userId) {
      fetch(`/api/doctor/bank_details/${userId}`)
        .then((response) => {
          console.log("Fetch response status:", response.status);
          if (!response.ok) {
            if (response.status === 404) {
              setLoading(false);
              return null;
            }
            throw new Error(`Failed to fetch bank details: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Fetched data:", data);
          setLoading(false);
          if (data) {
            setFullName(data.fullName);
            setState(data.state);
            setCity(data.city);
            setPostcode(data.pincode);
            setAccountHolderName(data.accountHolderName);
            setBankName(data.bankName);
            setAccountNumber(data.accountNumber);
            setIfscCode(data.ifscCode);
            setUpiId(data.upiId || "");
          }
        })
        .catch((err) => {
          console.log("Fetch error:", err);
          setLoading(false);
          setError(err.message);
          console.error("Error fetching bank details:", err);
        });
    } else {
      setLoading(false);
    }
  }, [userId]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    switch (name) {
      case "fullName":
        setFullName(value);
        break;
      case "state":
        setState(value);
        break;
      case "city":
        setCity(value);
        break;
      case "postcode":
        setPostcode(value);
        break;
      case "accountHolderName":
        setAccountHolderName(value);
        break;
      case "bankName":
        setBankName(value);
        break;
      case "accountNumber":
        setAccountNumber(value);
        break;
      case "ifscCode":
        setIfscCode(value);
        break;
      case "upiId":
        setUpiId(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    event.stopPropagation(); // Add this to prevent event bubbling
    
    console.log("🚀 Form submitted");
    
    if (!userId) {
      console.log("❌ No userId, showing error toast");
      toast.error("User ID not found. Please log in again.");
      return;
    }

    setLoading(true);
    setError(null);

    const payoutDetails = {
      doctorId: parseInt(userId),
      fullName,
      state,
      city,
      pincode: postcode,
      accountHolderName,
      bankName,
      accountNumber,
      ifscCode,
      upiId: upiId || null,
    };

    console.log("📤 Submitting payout details:", payoutDetails);

    try {
      console.log("🌐 Making API call...");
      
      // Simplified fetch without timeout complications
      const response = await fetch(`/api/doctor/bank_details/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payoutDetails),
      });

      console.log("📥 Response received:");
      console.log("   Status:", response.status);
      console.log("   Status Text:", response.statusText);
      console.log("   OK:", response.ok);

      if (!response.ok) {
        console.log("❌ Response not OK, handling error...");
        let errorData;
        try {
          errorData = await response.json();
          console.log("📄 Error response data:", errorData);
        } catch (jsonError) {
          console.log("⚠️ Failed to parse error response as JSON:", jsonError);
          errorData = { message: response.statusText };
        }
        
        const errorMessage = `Failed to save bank details: ${response.status} - ${
          errorData?.message || response.statusText
        }`;
        
        console.log("🔴 About to show error toast:", errorMessage);
        setError(errorMessage);
        
        // Use setTimeout to ensure toast shows
        setTimeout(() => {
          toast.error(errorMessage);
        }, 100);
        
        return;
      }

      console.log("✅ Response OK! About to show success toast...");
      
      // Try to read response data but don't let it block
      try {
        const responseData = await response.json();
        console.log("📄 Success response data:", responseData);
      } catch (jsonError) {
        console.log("⚠️ Response might not have JSON body (that's OK):", jsonError);
      }
      
      console.log("🟢 Calling success toast...");
      
      // Use setTimeout to ensure toast shows before any potential navigation
      setTimeout(() => {
        toast.success("Bank details saved successfully!", {
          onClose: () => {
            console.log("Success toast closed");
          }
        });
      }, 100);
      
    } catch (err: unknown) {
      console.error("💥 Caught error in handleSubmit:", err);
      let errorMessage = "An unexpected error occurred while saving bank details.";

      if (err instanceof Error) {
        errorMessage = err.message;
        console.log("Error name:", err.name);
        console.log("Error stack:", err.stack);
      } else if (typeof err === "string") {
        errorMessage = err;
      }

      console.log("🔴 About to show caught error toast:", errorMessage);
      setError(errorMessage);
      
      // Use setTimeout to ensure toast shows
      setTimeout(() => {
        toast.error(errorMessage);
      }, 100);
      
    } finally {
      console.log("🏁 Finally block - setting loading to false");
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading bank details...</div>;
  }

  if (error) {
    return <div>Error loading or saving bank details: {error}</div>;
  }

  return (
    <div className="max-w-3xl bg-white p-6 shadow-md rounded-lg border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Setup Payout Account
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-800">
            Full Name *
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
            name="fullName"
            value={fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-800">
              State *
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
              name="state"
              value={state}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800">
              City *
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
              name="city"
              value={city}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800">
              Postcode *
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
              name="postcode"
              value={postcode}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-800">
              Account Holder Name (as per bank account) *
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
              name="accountHolderName"
              value={accountHolderName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800">
              Bank Name *
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
              name="bankName"
              value={bankName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-800">
              Account Number *
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
              name="accountNumber"
              value={accountNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800">
              IFSC Code *
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
              name="ifscCode"
              value={ifscCode}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-800">
              UPI id
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
              name="upiId"
              value={upiId}
              onChange={handleChange}
            />
          </div>
          <div></div>
        </div>
        
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm shadow cursor-pointer disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Saving Changes..." : "Save Changes"}
        </button>
      </form>

      {/* ToastContainer with higher z-index and explicit positioning */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ 
          zIndex: 999999,
        }}
        toastStyle={{
          zIndex: 999999,
        }}
        limit={3} // Limit number of toasts
      />
    </div>
  );
};

export default PayoutForm;