"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RazorpayComponent = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Razorpay</CardTitle>
        <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="razorpay-key">Key ID</Label>
            <Input
              id="razorpay-key"
              placeholder="Enter Razorpay Key ID"
              disabled={!isEnabled}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="razorpay-secret">Key Secret</Label>
            <Input
              id="razorpay-secret"
              type="password"
              placeholder="Enter Razorpay Key Secret"
              disabled={!isEnabled}
              className="col-span-3"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RazorpayComponent;
