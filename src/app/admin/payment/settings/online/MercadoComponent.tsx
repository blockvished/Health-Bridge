"use client"

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MercadoComponent: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Mercado Pago Settings</CardTitle>
        <Switch 
          checked={isEnabled} 
          onCheckedChange={setIsEnabled}
        />
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="mercado-publish-key" className="text-right">
              Publish Key
            </Label>
            <Input 
              id="mercado-publish-key"
              placeholder="Enter Publish Key"
              disabled={!isEnabled}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="mercado-access-token" className="text-right">
              Access Token
            </Label>
            <Input 
              id="mercado-access-token"
              placeholder="Enter Access Token"
              disabled={!isEnabled}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="mercado-currency" className="text-right">
              Default Currency
            </Label>
            <Select disabled={!isEnabled}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="brl">BRL (Brazilian Real)</SelectItem>
                <SelectItem value="usd">USD (US Dollar)</SelectItem>
                <SelectItem value="eur">EUR (Euro)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MercadoComponent;