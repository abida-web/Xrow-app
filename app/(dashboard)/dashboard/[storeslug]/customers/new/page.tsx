"use client";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField } from "@/components/ui/form-field";
import { useCustomerForm } from "@/hooks/use-customer-form";
import { ArrowRight, PlusCircle, User } from "lucide-react";
import React, { useState } from "react";
import IntlTelInput from "@intl-tel-input/react";
import "intl-tel-input/styles";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import CustomeFormDialoge from "@/app/(dashboard)/_components/CustomeFormDialoge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countriesList } from "@/app/constants/countries";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useCustomerStore } from "@/stores/customer-store";
import { initialCountryLookup } from "@/lib/utils";

const CreateNewCustomerPage = () => {
  const params = useParams();
  const storeslug = String(params.storeslug);
  const { extendedCustomerForm, setField } = useCustomerForm();
  const resetExtendedCustomerForm = useCustomerStore(
    (state) => state.resetExtendedCustomerForm,
  );

  const [openDialog, setOpenDialog] = useState(false);

  const handleChangeNumber = (newNumber: string) => {
    setField("phone", newNumber);
  };

  const handleSaveAddress = () => {
    // Save address directly to the store
    setField("address1", tempAddress.address1);
    setField("address2", tempAddress.address2);
    setField("city", tempAddress.city);
    setField("zip", tempAddress.zip);
    setField("postalCode", tempAddress.postalCode);
    setField("country", tempAddress.country);
    setField("acceptsMarketing", tempAddress.acceptsMarketing);

    // Reset temp address
    setTempAddress({
      address1: "",
      address2: "",
      city: "",
      postalCode: "",
      zip: "",
      country: "",
      acceptsMarketing: false,
    });
    setOpenDialog(false);
  };

  const [tempAddress, setTempAddress] = useState({
    address1: "",
    address2: "",
    city: "",
    postalCode: "",
    zip: "",
    country: "",
    acceptsMarketing: false,
  });

  const hasAddress = !!(
    extendedCustomerForm.address1 ||
    extendedCustomerForm.city ||
    extendedCustomerForm.country
  );

  const getCountryName = (countryCode: string) => {
    const country = countriesList.find((c) => c.code === countryCode);
    return country ? country.name : countryCode;
  };

  const handleCreateCustomer = async () => {
    try {
      const res = await fetch("/api/dashboard/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ extendedCustomerForm, storeslug }),
      });
      if (res.ok) {
        toast.success("Customer added successfully");
        resetExtendedCustomerForm();
      } else {
        toast.error("Failed to add customer");
      }
    } catch (error) {
      toast.error("Failed to add customer");
    }
  };

  const handleEditAddress = () => {
    // Load existing address into temp for editing
    setTempAddress({
      address1: extendedCustomerForm.address1 || "",
      address2: extendedCustomerForm.address2 || "",
      city: extendedCustomerForm.city || "",
      zip: extendedCustomerForm.zip || "",
      postalCode: extendedCustomerForm.postalCode || "",
      country: extendedCustomerForm.country || "",
      acceptsMarketing: extendedCustomerForm.acceptsMarketing || false,
    });
    setOpenDialog(true);
  };

  const handleRemoveAddress = () => {
    // Clear address fields in store
    setField("address1", "");
    setField("address2", "");
    setField("city", "");
    setField("zip", "");
    setField("postalCode", "");
    setField("country", "");
    setField("acceptsMarketing", false);
  };

  return (
    <div>
      <div className="flex items-center gap-1 text-gray-800">
        <User className="w-5 h-5" />
        <p className="text-sm font-semibold">New customer</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-[800px_1fr] gap-5 mt-3">
        <div className="flex flex-col">
          <Card className="p-4">
            <h1 className="text-[13px] text-gray-600 font-semibold">
              Customer overview
            </h1>
            <div className="grid grid-cols-2 gap-5">
              <FormField label="First name" htmlFor="firstname">
                <Input
                  id="firstname"
                  type="text"
                  className="mt-1.5 w-full"
                  required
                  value={extendedCustomerForm.firstName}
                  onChange={(e) => setField("firstName", e.target.value)}
                  aria-label="firstname"
                />
              </FormField>
              <FormField label="Last name" htmlFor="lastname">
                <Input
                  id="lastname"
                  type="text"
                  className="mt-1.5 w-full"
                  required
                  value={extendedCustomerForm.lastName}
                  onChange={(e) => setField("lastName", e.target.value)}
                  aria-label="lastname"
                />
              </FormField>
              <div className="col-span-2">
                <FormField label="Email" htmlFor="email">
                  <Input
                    id="email"
                    type="email"
                    className="mt-1.5 w-full"
                    required
                    value={extendedCustomerForm.email}
                    onChange={(e) => setField("email", e.target.value)}
                    aria-label="email"
                  />
                </FormField>
              </div>
              <div className="col-span-2">
                <Label htmlFor="phone" className="text-xs mb-2 font-medium">
                  Phone number
                </Label>
                <IntlTelInput
                  onChangeNumber={handleChangeNumber}
                  initialCountryLookup={initialCountryLookup}
                  loadUtils={() => import("intl-tel-input/utils")}
                  inputProps={{
                    id: "phone",
                    value: extendedCustomerForm.phone || "",
                  }}
                />
              </div>
            </div>
          </Card>

          <Card className="p-4 mt-5 flex flex-col">
            <h1 className="text-[14px] text-gray-600 font-semibold">
              Default address
            </h1>
            <p className="text-[13px] text-gray-500 mb-4">
              The primary address of this customer
            </p>

            {!hasAddress ? (
              <Button
                onClick={() => {
                  setTempAddress({
                    address1: "",
                    address2: "",
                    city: "",
                    zip: "",
                    postalCode: "",
                    country: "",
                    acceptsMarketing: false,
                  });
                  setOpenDialog(true);
                }}
                type="button"
                variant="outline"
                className="text-gray-500 flex justify-between items-center group"
              >
                <span className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Add address
                </span>
                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            ) : (
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex items-start justify-between p-3 bg-gray-50 rounded-lg border">
                  <div className="flex flex-col gap-1">
                    {extendedCustomerForm.address1 && (
                      <p className="text-sm">{extendedCustomerForm.address1}</p>
                    )}
                    {extendedCustomerForm.address2 && (
                      <p className="text-sm">{extendedCustomerForm.address2}</p>
                    )}
                    {(extendedCustomerForm.city ||
                      extendedCustomerForm.zip) && (
                      <p className="text-sm">
                        {extendedCustomerForm.city}
                        {extendedCustomerForm.city &&
                          extendedCustomerForm.zip &&
                          ", "}
                        {extendedCustomerForm.zip}
                      </p>
                    )}
                    {extendedCustomerForm.country && (
                      <p className="text-sm">
                        {getCountryName(extendedCustomerForm.country)}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <Checkbox
                        id="marketing"
                        checked={extendedCustomerForm.acceptsMarketing}
                        onCheckedChange={(checked) => {
                          setField("acceptsMarketing", checked === true);
                        }}
                        className="h-3 w-3"
                      />
                      <Label
                        htmlFor="marketing"
                        className="text-xs text-gray-500 cursor-pointer"
                      >
                        Agreed to marketing emails
                      </Label>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleEditAddress}
                      className="h-8 px-2"
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveAddress}
                      className="h-8 px-2 text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card className="p-5 h-fit">
            <h1 className="text-sm text-gray-600 font-semibold">Notes</h1>
            <Textarea
              placeholder="Write your note"
              value={extendedCustomerForm.note}
              onChange={(e) => setField("note", e.target.value)}
            />
          </Card>

          {/* Preview Section */}
          <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg border">
            <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">
              Preview
            </h3>

            {/* Customer Info */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-500 uppercase">
                Customer Information
              </p>
              <div className="text-sm space-y-1">
                <p>
                  <span className="font-medium">Name:</span>{" "}
                  {extendedCustomerForm.firstName || "—"}{" "}
                  {extendedCustomerForm.lastName || ""}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {extendedCustomerForm.email || "Not provided"}
                </p>
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {extendedCustomerForm.phone || "Not provided"}
                </p>
              </div>
            </div>

            {/* Address */}
            {hasAddress && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-500 uppercase">
                  Default Address
                </p>
                <div className="text-sm space-y-1">
                  {extendedCustomerForm.address1 && (
                    <p>{extendedCustomerForm.address1}</p>
                  )}
                  {extendedCustomerForm.address2 && (
                    <p>{extendedCustomerForm.address2}</p>
                  )}
                  {(extendedCustomerForm.city || extendedCustomerForm.zip) && (
                    <p>
                      {extendedCustomerForm.city} {extendedCustomerForm.zip}
                    </p>
                  )}
                  {extendedCustomerForm.country && (
                    <p>{getCountryName(extendedCustomerForm.country)}</p>
                  )}
                  <p className="text-xs">
                    {extendedCustomerForm.acceptsMarketing ? (
                      <span className="text-green-600">
                        ✓ Agreed to marketing emails
                      </span>
                    ) : (
                      <span className="text-gray-400">
                        ✗ Not agreed to marketing emails
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* Notes */}
            {extendedCustomerForm.note && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-500 uppercase">
                  Notes
                </p>
                <p className="text-sm text-gray-600">
                  {extendedCustomerForm.note}
                </p>
              </div>
            )}
          </div>
          <Button onClick={handleCreateCustomer}>Create customer</Button>
        </div>
      </div>

      <CustomeFormDialoge
        isOpen={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setTempAddress({
            address1: "",
            address2: "",
            city: "",
            zip: "",
            postalCode: "",
            country: "",
            acceptsMarketing: false,
          });
        }}
        title="Add default address"
        onSave={handleSaveAddress}
      >
        <div className="flex flex-col gap-4">
          <FormField label="Address line 1" htmlFor="address1">
            <Input
              id="address1"
              type="text"
              placeholder="Street address"
              className="mt-1.5 w-full"
              value={tempAddress.address1}
              onChange={(e) =>
                setTempAddress({ ...tempAddress, address1: e.target.value })
              }
            />
          </FormField>

          <FormField label="Address line 2" htmlFor="address2">
            <Input
              id="address2"
              type="text"
              placeholder="Apartment, suite, unit, etc. (optional)"
              className="mt-1.5 w-full"
              value={tempAddress.address2}
              onChange={(e) =>
                setTempAddress({ ...tempAddress, address2: e.target.value })
              }
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Country" htmlFor="country">
              <Select
                value={tempAddress.country}
                onValueChange={(value) =>
                  setTempAddress({ ...tempAddress, country: value })
                }
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {countriesList.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="City" htmlFor="city">
              <Input
                id="city"
                type="text"
                placeholder="City"
                className="mt-1.5 w-full"
                value={tempAddress.city}
                onChange={(e) =>
                  setTempAddress({ ...tempAddress, city: e.target.value })
                }
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Zip" htmlFor="zip">
              <Input
                id="zip"
                type="text"
                placeholder="ZIP code"
                className="mt-1.5 w-full"
                value={tempAddress.zip}
                onChange={(e) =>
                  setTempAddress({ ...tempAddress, zip: e.target.value })
                }
              />
            </FormField>

            <FormField label="Postal Code" htmlFor="postalCode">
              <Input
                id="postalCode"
                type="text"
                placeholder="Postal code"
                className="mt-1.5 w-full"
                value={tempAddress.postalCode}
                onChange={(e) =>
                  setTempAddress({ ...tempAddress, postalCode: e.target.value })
                }
              />
            </FormField>
          </div>

          <div className="flex items-center space-x-2 mt-2">
            <Checkbox
              id="marketing-address"
              checked={tempAddress.acceptsMarketing}
              onCheckedChange={(checked) =>
                setTempAddress({
                  ...tempAddress,
                  acceptsMarketing: checked === true,
                })
              }
            />
            <Label
              htmlFor="marketing-address"
              className="text-sm font-medium cursor-pointer"
            >
              Customer agreed to receive marketing emails for this address
            </Label>
          </div>
        </div>
      </CustomeFormDialoge>
    </div>
  );
};

export default CreateNewCustomerPage;
