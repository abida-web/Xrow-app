"use client";
import { editContactInformation, getCustomer } from "@/actions/getCustomers";
import CustomeFormDialoge from "@/app/(dashboard)/_components/CustomeFormDialoge";
import { countriesList } from "@/app/constants/countries";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCustomerForm } from "@/hooks/use-customer-form";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { format } from "date-fns";
import { Copy } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Customer {
  id: string;
  email: string;
  phone: string | null;
  subscribe: boolean | null;
  firstName: string | null;
  lastName: string | null;
  note: string | null;
  storeId: string | null;
  createdAt: string;
  updatedAt: string;
  orders: any[];
  addresses: Address[];
  giftCards: any[];
}

interface Address {
  id: string;
  customerId: string;
  country: string;
  city: string;
  addressLineOne: string;
  addressLineTwo: string;
  postalCode: string;
  zip: string;
  acceptsMarketing: boolean;
  totalSpent: string;
  createdAt: string;
}

const CustomerDetailPage = () => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSubDialog, setOpenSubDialog] = useState(false);

  const { setField, extendedCustomerForm, populateForm, resetForm } =
    useCustomerForm();
  const params = useParams();
  const id = String(params.id);
  const storeslug = String(params.storeslug);
  const router = useRouter();

  useEffect(() => {
    fetchCustomer();
  }, []);

  useEffect(() => {
    if (customer) {
      populateForm(customer);
    }
  }, [customer, populateForm]);

  const fetchCustomer = async () => {
    setLoading(true);
    try {
      const res = await getCustomer(storeslug, id);
      if (res) {
        setCustomer(res as unknown as Customer);
      } else {
        setCustomer(null);
      }
    } catch (error) {
      console.error("Failed to load customer:", error);
      toast.error("Failed to load customer");
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  };

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Email copied!");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedCustomer = await editContactInformation(storeslug, id, {
        firstName: extendedCustomerForm.firstName,
        lastName: extendedCustomerForm.lastName,
        email: extendedCustomerForm.email,
        phone: extendedCustomerForm.phone,
        note: extendedCustomerForm.note,
      });

      setCustomer((prev) => ({
        ...prev!,
        firstName: updatedCustomer[0].firstName || "",
        lastName: updatedCustomer[0].lastName || "",
        email: updatedCustomer[0].email || "",
        phone: updatedCustomer[0].phone || "",
        note: updatedCustomer[0].note || "",
      }));

      toast.success("Customer updated successfully!");
      setOpenDialog(false);
    } catch (error) {
      console.error("Failed to update customer:", error);
      toast.error("Failed to update customer");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAddress = () => {
    // Update customer state with the address from store
    setCustomer((prev) => {
      if (!prev) return null;
      const existingAddress = prev.addresses?.[0] || {};
      return {
        ...prev,
        addresses: [
          {
            id: existingAddress.id || "",
            customerId: prev.id,
            addressLineOne: extendedCustomerForm.address1 || "",
            addressLineTwo: extendedCustomerForm.address2 || "",
            city: extendedCustomerForm.city || "",
            zip: extendedCustomerForm.zip || "",
            postalCode: extendedCustomerForm.postalCode || "",
            country: extendedCustomerForm.country || "",
            acceptsMarketing: extendedCustomerForm.acceptsMarketing || false,
            totalSpent: "0",
            createdAt: existingAddress.createdAt || new Date().toISOString(),
          },
        ],
      };
    });

    toast.success("Address updated successfully!");
    setOpenSubDialog(false);
  };

  const getCountryName = (countryCode: string) => {
    const country = countriesList.find((c) => c.code === countryCode);
    return country ? country.name : countryCode;
  };

  if (loading) return <div>Loading...</div>;
  if (!customer) return <div>Customer not found</div>;

  return (
    <div className="bg-gray-100">
      <div className="grid lg:grid-cols-[800px_1fr] grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-5">
          <Card>
            <div className="grid sm:grid-cols-3 gap-5 px-5">
              <div className="flex flex-col items-center p-3 border rounded-lg text-sm font-semibold">
                <span className="text-gray-400">Amount spent</span>
                <span className="text-xs">0.00</span>
              </div>
              <div className="flex flex-col items-center p-3 border rounded-lg text-sm font-semibold">
                <span className="text-gray-400">Orders</span>
                <span className="text-xs">0</span>
              </div>
              <div className="flex flex-col items-center p-3 border rounded-lg text-sm font-semibold">
                <span className="text-gray-400">Customer since</span>
                <span className="text-xs">
                  {customer?.createdAt
                    ? format(new Date(customer.createdAt), "yyyy-MM-dd")
                    : "N/A"}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex flex-col text-xs gap-1.5">
              <h1 className="text-[16px] font-semibold text-gray-600">
                Last order placed
              </h1>
              <p className="text-gray-400">
                This customer hasn't placed any orders yet
              </p>
              <Button
                size={"sm"}
                className={"w-fit"}
                variant={"outline"}
                onClick={() =>
                  router.push(`/dashboard/${storeslug}/orders/new`)
                }
              >
                Create order
              </Button>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-5">
          <div className="p-6 border rounded-lg shadow-sm bg-white max-w-md">
            <div className="border-b pb-3 mb-4">
              <div className="flex justify-between items-center">
                <h1 className="text-sm font-semibold text-gray-900">
                  Customer
                </h1>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-lg text-gray-500">...</button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="mr-4">
                    <DropdownMenuItem
                      onClick={() => {
                        populateForm(customer);
                        setOpenDialog(true);
                      }}
                      className="text-xs"
                    >
                      Edit contact information
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        populateForm(customer);
                        setOpenSubDialog(true);
                      }}
                      className="text-xs"
                    >
                      Manage address
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Contact information
              </p>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 min-w-0">
                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="text-sm text-gray-700 truncate">
                      {customer?.email}
                    </p>
                  </div>
                </div>
                {customer?.email && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => copyToClipboard(customer.email)}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
              <div>
                <p className="text-xs text-gray-400">Phone</p>
                <p className="text-sm text-gray-700">{customer?.phone}</p>
              </div>
              {customer?.subscribe && (
                <div className="mt-1">
                  <p className="text-xs text-green-600 font-medium">
                    ✅ Will receive notifications in English
                  </p>
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                Default Address
              </p>
              {customer?.addresses?.map((add, index) => (
                <div
                  key={add.id || index}
                  className="space-y-1.5 text-sm text-gray-700"
                >
                  <div>
                    <p className="text-xs text-gray-400">Full Name</p>
                    <p className="font-medium">
                      {customer.firstName} {customer.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Address Line 1</p>
                    <p>{add.addressLineOne}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Address Line 2</p>
                    <p>{add.addressLineTwo}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">ZIP Code</p>
                    <p>{add.zip}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Postal Code / City</p>
                    <p>
                      {add.postalCode} {add.city}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Country</p>
                    <p className="uppercase">{getCountryName(add.country)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Phone</p>
                    <p>{customer.phone}</p>
                  </div>
                  <div className="pt-1">
                    <p className="text-xs text-gray-400">
                      Marketing Preference
                    </p>
                    <p className="text-xs mt-0.5">
                      {add.acceptsMarketing ? (
                        <span className="text-blue-600">
                          📱 Marketing available via email, SMS, WhatsApp
                        </span>
                      ) : (
                        <span className="text-gray-400">
                          Marketing unavailable
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {extendedCustomerForm && (
            <Card className="p-4">
              <h1 className="text-gray-600 text-sm font-semibold">Note</h1>
              <p>{extendedCustomerForm.note}</p>
            </Card>
          )}
        </div>
      </div>

      <CustomeFormDialoge
        isOpen={openDialog}
        onClose={() => {
          setOpenDialog(false);
          resetForm();
        }}
        onSave={handleSave}
        title="Edit customer"
      >
        <div className="grid grid-cols-2 gap-5">
          <FormField label="First name" htmlFor="firstname">
            <Input
              id="firstname"
              type="text"
              className="mt-1.5 w-full"
              required
              value={extendedCustomerForm.firstName || ""}
              onChange={(e) => setField("firstName", e.target.value)}
            />
          </FormField>
          <FormField label="Last name" htmlFor="lastname">
            <Input
              id="lastname"
              type="text"
              className="mt-1.5 w-full"
              required
              value={extendedCustomerForm.lastName || ""}
              onChange={(e) => setField("lastName", e.target.value)}
            />
          </FormField>
          <div className="col-span-2">
            <FormField label="Email" htmlFor="email">
              <Input
                id="email"
                type="email"
                className="mt-1.5 w-full"
                required
                value={extendedCustomerForm.email || ""}
                onChange={(e) => setField("email", e.target.value)}
              />
            </FormField>
          </div>
          <div className="col-span-2">
            <FormField label="Phone" htmlFor="phone">
              <Input
                id="phone"
                type="tel"
                className="mt-1.5 w-full"
                required
                value={extendedCustomerForm.phone || ""}
                onChange={(e) => setField("phone", e.target.value)}
              />
            </FormField>
          </div>
          <div className="col-span-2">
            <FormField label="Note" htmlFor="note">
              <Input
                id="note"
                type="text"
                className="mt-1.5 w-full"
                required
                value={extendedCustomerForm.note || ""}
                onChange={(e) => setField("note", e.target.value)}
              />
            </FormField>
          </div>
        </div>
      </CustomeFormDialoge>

      <CustomeFormDialoge
        isOpen={openSubDialog}
        onClose={() => {
          setOpenSubDialog(false);
          resetForm();
        }}
        onSave={handleSaveAddress}
        title="Edit address"
      >
        <div className="flex flex-col gap-4">
          <FormField label="Address line 1" htmlFor="address1">
            <Input
              id="address1"
              type="text"
              placeholder="Street address"
              className="mt-1.5 w-full"
              value={extendedCustomerForm.address1 || ""}
              onChange={(e) => setField("address1", e.target.value)}
            />
          </FormField>

          <FormField label="Address line 2" htmlFor="address2">
            <Input
              id="address2"
              type="text"
              placeholder="Apartment, suite, unit, etc. (optional)"
              className="mt-1.5 w-full"
              value={extendedCustomerForm.address2 || ""}
              onChange={(e) => setField("address2", e.target.value)}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Country" htmlFor="country">
              <Select
                value={extendedCustomerForm.country || ""}
                onValueChange={(value) => setField("country", value)}
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
                value={extendedCustomerForm.city || ""}
                onChange={(e) => setField("city", e.target.value)}
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
                value={extendedCustomerForm.zip || ""}
                onChange={(e) => setField("zip", e.target.value)}
              />
            </FormField>

            <FormField label="Postal Code" htmlFor="postalCode">
              <Input
                id="postalCode"
                type="text"
                placeholder="Postal code"
                className="mt-1.5 w-full"
                value={extendedCustomerForm.postalCode || ""}
                onChange={(e) => setField("postalCode", e.target.value)}
              />
            </FormField>
          </div>

          <div className="flex items-center space-x-2 mt-2">
            <Checkbox
              id="marketing-address"
              checked={extendedCustomerForm.acceptsMarketing || false}
              onCheckedChange={(checked) =>
                setField("acceptsMarketing", checked === true)
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

export default CustomerDetailPage;
