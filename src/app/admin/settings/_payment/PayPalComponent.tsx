"use client"

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PayPalComponent: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>PayPal Settings</CardTitle>
        <Switch 
          checked={isEnabled} 
          onCheckedChange={setIsEnabled}
        />
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="paypal-mode" className="text-right">
              PayPal Mode
            </Label>
            <Select disabled={!isEnabled}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="sandbox">Sandbox</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="paypal-account" className="text-right">
              PayPal Account
            </Label>
            <Input 
              id="paypal-account"
              placeholder="your.paypal@email.com"
              disabled={!isEnabled}
              className="col-span-3"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PayPalComponent;