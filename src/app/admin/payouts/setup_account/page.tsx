"use client"
import React, { useState, ChangeEvent, FormEvent } from "react";

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

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    // Here you would typically make an API call to save the payout information
    const payoutDetails = {
      fullName,
      state,
      city,
      postcode,
      accountHolderName,
      bankName,
      accountNumber,
      ifscCode,
      upiId,
    };
    console.log("Payout Details:", payoutDetails);
    // Optionally, you can reset the form after successful submission
    // setFullName("");
    // setState("");
    // setCity("");
    // setPostcode("");
    // setAccountHolderName("");
    // setBankName("");
    // setAccountNumber("");
    // setIfscCode("");
    // setUpiId("");
  };

  return (
    <div className="max-w-3xl bg-white p-6 shadow-md rounded-lg border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Setup Payout Account</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-800">Full Name *</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
            name="fullName"
            value={fullName}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-800">State *</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
              name="state"
              value={state}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800">City *</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
              name="city"
              value={city}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800">Postcode *</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
              name="postcode"
              value={postcode}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-800">Account Holder Name (as per bank account) *</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
              name="accountHolderName"
              value={accountHolderName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800">Bank Name *</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
              name="bankName"
              value={bankName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-800">Account Number *</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
              name="accountNumber"
              value={accountNumber}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800">IFSC Code *</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
              name="ifscCode"
              value={ifscCode}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-800">UPI id *</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
              name="upiId"
              value={upiId}
              onChange={handleChange}
            />
          </div>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded text-sm shadow">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default PayoutForm;