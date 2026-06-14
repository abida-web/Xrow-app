"use client";
import { CURRENCIES } from "@/app/constants/services";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useCustomerStore } from "@/stores/customer-store";
import { format } from "date-fns";
import { ChevronDownIcon, Edit2Icon, Gift } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface CustomerFormData {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
}

interface GiftFormData {
  code: string;
  initialValue: string;
  currency: string;
  note: string;
  expiresOn: Date;
  currentBalance: string;
}

const CreateNewGiftPage = () => {
  const params = useParams();
  const storeslug = String(params.storeslug);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const customerForm = useCustomerStore((state) => state.customerForm);
  const setCustomerForm = useCustomerStore((state) => state.setCustomerForm);
  const resetCustomerForm = useCustomerStore(
    (state) => state.resetCustomerForm,
  );
  const [giftFormData, setGiftFormData] = useState<GiftFormData>({
    code: "",
    initialValue: "",
    currency: "USD",
    note: "",
    expiresOn: new Date(),
    currentBalance: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    // Validate date is not in the past
    if (date && date < new Date()) {
      toast.error("Expiry date cannot be in the past");
      return;
    }
    setSelectedDate(date);
    setGiftFormData({ ...giftFormData, expiresOn: date || new Date() });
  };

  const handleInitialValueChange = (value: string) => {
    setGiftFormData({
      ...giftFormData,
      initialValue: value,
      // Auto-populate current balance if not manually set
      currentBalance: giftFormData.currentBalance || value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (!giftFormData.code.trim()) {
      toast.error("Please enter gift card code");
      return;
    }

    const initialValueNum = parseFloat(giftFormData.initialValue);
    if (isNaN(initialValueNum) || initialValueNum <= 0) {
      toast.error("Initial value must be a positive number");
      return;
    }

    let currentBalanceNum = initialValueNum;
    if (giftFormData.currentBalance) {
      currentBalanceNum = parseFloat(giftFormData.currentBalance);
      if (isNaN(currentBalanceNum) || currentBalanceNum < 0) {
        toast.error("Current balance must be a valid positive number");
        return;
      }
      if (currentBalanceNum > initialValueNum) {
        toast.error("Current balance cannot exceed initial value");
        return;
      }
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/dashboard/gift-cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          giftFormData: {
            ...giftFormData,
            initialValue: initialValueNum,
            currentBalance: currentBalanceNum,
          },
          customerForm,
          storeslug,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Gift card created successfully");
        // Reset forms
        setGiftFormData({
          code: "",
          initialValue: "",
          currency: "USD",
          note: "",
          expiresOn: new Date(),
          currentBalance: "",
        });
        resetCustomerForm();
        setSelectedDate(new Date());
      } else {
        toast.error(data.error || "Failed to create gift card");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to create gift card");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl">
      {/* Header Section */}
      <div className="mb-6">
        <p className="flex items-center gap-2 font-semibold text-lg sm:text-xl lg:text-2xl">
          <Gift className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
          Create gift card
        </p>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Fill in the details below to create a new gift card
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col lg:flex-row gap-5 lg:gap-6"
      >
        {/* Main Form Section - Gift Card Details */}
        <div className="flex-1 min-w-0">
          <Card className="p-4 sm:p-5 lg:p-6">
            <p className="text-sm sm:text-base font-semibold mb-4">
              Gift card details
            </p>

            {/* Gift Card Code */}
            <div className="mb-4">
              <Label htmlFor="code" className="text-sm font-medium">
                Gift card code
              </Label>
              <Input
                id="code"
                placeholder="Enter the gift card code"
                value={giftFormData.code}
                onChange={(e) =>
                  setGiftFormData({ ...giftFormData, code: e.target.value })
                }
                className="w-full mt-1.5"
                aria-label="Gift card code"
              />
            </div>

            {/* Initial Value & Current Balance - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="initialValue" className="text-sm font-medium">
                  Initial value
                </Label>
                <Input
                  id="initialValue"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="mt-1.5 w-full"
                  required
                  value={giftFormData.initialValue}
                  onChange={(e) => handleInitialValueChange(e.target.value)}
                  aria-label="Initial value"
                />
              </div>
              <div>
                <Label htmlFor="currentBalance" className="text-sm font-medium">
                  Current Balance
                  <span className="text-xs text-gray-400 ml-1">(optional)</span>
                </Label>
                <Input
                  id="currentBalance"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="mt-1.5 w-full"
                  value={giftFormData.currentBalance}
                  onChange={(e) =>
                    setGiftFormData({
                      ...giftFormData,
                      currentBalance: e.target.value,
                    })
                  }
                  aria-label="Current balance"
                />
              </div>
            </div>

            {/* Currency & Expiry Date - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currency" className="text-sm font-medium">
                  Currency
                </Label>
                <select
                  id="currency"
                  value={giftFormData.currency}
                  onChange={(e) =>
                    setGiftFormData({
                      ...giftFormData,
                      currency: e.target.value,
                    })
                  }
                  className="w-full py-2 px-3 border rounded-lg border-gray-300 bg-background text-foreground mt-1.5 focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Select currency"
                >
                  {CURRENCIES.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name} ({currency.symbol})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-sm font-medium block mb-1.5">
                  Expiry Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between text-left font-normal"
                      aria-label="Select expiry date"
                    >
                      {giftFormData.expiresOn ? (
                        format(giftFormData.expiresOn, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <ChevronDownIcon className="h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0"
                    align="start"
                    sideOffset={5}
                  >
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      defaultMonth={new Date()}
                      disabled={{ before: new Date() }}
                      className="rounded-md border"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar Section - Customer & Note */}
        <div className="w-full lg:w-[400px] xl:w-[450px] flex flex-col gap-5 lg:gap-6">
          {/* Customer Information Card */}
          <Card className="p-4 sm:p-5 lg:p-6">
            <div className="mb-4">
              <p className="text-sm sm:text-base font-semibold">Add Customer</p>
              <p className="text-xs text-gray-400 mt-1">
                Or you can add customers later
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Input
                value={customerForm.email}
                onChange={(e) => setCustomerForm({ email: e.target.value })}
                placeholder="Email address"
                type="email"
                className="w-full"
                aria-label="Customer email"
              />
              <Input
                value={customerForm.phone}
                onChange={(e) => setCustomerForm({ phone: e.target.value })}
                placeholder="Phone number"
                type="tel"
                className="w-full"
                aria-label="Customer phone"
              />
              <Input
                value={customerForm.firstName}
                onChange={(e) => setCustomerForm({ firstName: e.target.value })}
                placeholder="First name"
                className="w-full"
                aria-label="Customer first name"
              />
              <Input
                value={customerForm.lastName}
                onChange={(e) => setCustomerForm({ lastName: e.target.value })}
                placeholder="Last name"
                className="w-full"
                aria-label="Customer last name"
              />
              <Button
                type="button"
                variant="outline"
                onClick={resetCustomerForm}
                className="w-full sm:w-auto"
                aria-label="Clear customer form"
              >
                Clear all
              </Button>
            </div>
          </Card>

          {/* Note Card */}
          <Card className="p-4 sm:p-5 lg:p-6">
            <Label
              htmlFor="note"
              className="text-sm font-medium flex items-center gap-2"
            >
              Note
              <Edit2Icon className="w-4 h-4 text-gray-400" />
            </Label>
            <Textarea
              id="note"
              value={giftFormData.note}
              onChange={(e) =>
                setGiftFormData({ ...giftFormData, note: e.target.value })
              }
              placeholder="Add a note about this gift card (optional)"
              className="w-full min-h-[100px] sm:min-h-[120px] mt-2"
              aria-label="Gift card note"
            />
          </Card>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full py-2 sm:py-3 text-sm sm:text-base"
            disabled={isLoading}
            size="lg"
            aria-label="Create gift card"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Creating...
              </div>
            ) : (
              "Create Gift Card"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateNewGiftPage;
