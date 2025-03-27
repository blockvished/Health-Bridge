"use client"
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const StripeComponent = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Stripe</CardTitle>
        <Switch 
          checked={isEnabled} 
          onCheckedChange={setIsEnabled}
        />
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stripe-publish-key">Publish Key</Label>
            <Input 
              id="stripe-publish-key" 
              placeholder="Enter Stripe Publish Key"
              disabled={!isEnabled}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stripe-secret-key">Secret Key</Label>
            <Input 
              id="stripe-secret-key" 
              type="password"
              placeholder="Enter Stripe Secret Key"
              disabled={!isEnabled}
              className="col-span-3"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StripeComponent;