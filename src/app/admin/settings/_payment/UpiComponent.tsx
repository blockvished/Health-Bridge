"use client"

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const UpiComponent: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Upi Settings</CardTitle>
        <Switch 
          checked={isEnabled} 
          onCheckedChange={setIsEnabled}
        />
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="paypal-mode" className="text-right">
              Upi Mode
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
            <Label htmlFor="upi-account" className="text-right">
              Upi Account
            </Label>
            <Input 
              id="upi-account"
              placeholder="your.upi@email.com"
              disabled={!isEnabled}
              className="col-span-3"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpiComponent;