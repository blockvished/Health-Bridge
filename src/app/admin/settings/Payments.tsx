import React from 'react'
import { Button } from "@/components/ui/button"
import PayPalComponent from './_payment/PayPalComponent'
import UpiComponent from './_payment/UpiComponent'
import CurrencySelection from './_payment/CurrencySelection'

const PaymentConfiguration = () => {
  const handleSaveConfiguration = () => {
    // Implement save logic for all payment gateway configurations
    console.log("Saving online payment configurations")
    // You might want to collect and validate data from each component
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Online Payment Configuration</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <CurrencySelection />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <PayPalComponent />
        <UpiComponent />
      </div>

      <div className="flex justify-start">
        <Button 
          className="px-6 py-3"
        >
          Save Changes
        </Button>
      </div>
    </div>
  )
}

export default PaymentConfiguration