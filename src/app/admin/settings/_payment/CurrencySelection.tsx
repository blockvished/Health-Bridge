"use client"
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
  } from "@/components/ui/select"
  
  export default function CurrencySelection() {
    const currencies = [
      { code: 'INR', name: 'India - INR (₹)' },
      { code: 'USD', name: 'United States - USD ($)' },
      { code: 'EUR', name: 'European Union - EUR (€)' },
      { code: 'GBP', name: 'United Kingdom - GBP (£)' },
      { code: 'JPY', name: 'Japan - JPY (¥)' },
    ]
  
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Currency" />
          </SelectTrigger>
          <SelectContent>
            {currencies.map((currency) => (
              <SelectItem key={currency.code} value={currency.code}>
                {currency.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }