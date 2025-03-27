"use client"
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PaystackComponent: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Paystack Settings</CardTitle>
        <Switch 
          checked={isEnabled} 
          onCheckedChange={setIsEnabled}
        />
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="paystack-publish-key" className="text-right">
              Publish Key
            </Label>
            <Input 
              id="paystack-publish-key"
              placeholder="Enter Paystack Publish Key"
              disabled={!isEnabled}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="paystack-secret-key" className="text-right">
              Secret Key
            </Label>
            <Input 
              id="paystack-secret-key"
              type="password"
              placeholder="Enter Paystack Secret Key"
              disabled={!isEnabled}
              className="col-span-3"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaystackComponent;