"use client";

import { deleteCustomers, getAllCustomers } from "@/actions/getCustomers";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchInput } from "@/components/ui/search-input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCustomerStore } from "@/stores/customer-store";
import { Customer } from "@/types";
import { ArrowLeft, ArrowRight, Search, Trash2, Users } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useSelectableRows } from "@/hooks/use-selectable-rows";
import { Button } from "@/components/ui/button";

const CustomersPage = () => {
  const params = useParams();
  const storeslug = String(params.storeslug);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [page, setPage] = useState(1);
  const searchCustomer = useCustomerStore((state) => state.searchCustomer);
  const setSearchCustomer = useCustomerStore(
    (state) => state.setSearchCustomer,
  );

  const filteredCustomers = useMemo(() => {
    return customers.filter(
      (cus) =>
        cus.firstName?.toLowerCase().includes(searchCustomer.toLowerCase()) ||
        cus.lastName?.toLowerCase().includes(searchCustomer.toLowerCase()) ||
        cus.email?.toLowerCase().includes(searchCustomer.toLowerCase()) ||
        cus.phone?.includes(searchCustomer.toLowerCase()),
    );
  }, [searchCustomer, customers]);

  const {
    selectedIds: selectRow,
    selectAll,
    toggleAll,
    toggleRow,
    clearSelection,
  } = useSelectableRows(filteredCustomers);

  useEffect(() => {
    fetchCustomers();
  }, [page]);

  const fetchCustomers = async () => {
    const customerList = await getAllCustomers(storeslug, page);
    setCustomers(customerList);
  };

  const router = useRouter();

  const handleSelectAll = () => {
    if (selectAll) {
      clearSelection();
    } else {
      toggleAll();
    }
  };

  const handleSelectCustomers = (customerId: string) => {
    toggleRow(customerId);
  };

  const handleDeleteCustomers = async () => {
    const deleteIds = Array.from(selectRow);
    const result = await deleteCustomers(storeslug, deleteIds);
    if (result.success) {
      toast.success(`Deleted ${deleteIds.length} customer(s)`);
      setCustomers(customers.filter((cus) => !deleteIds.includes(cus.id)));
      clearSelection();
      fetchCustomers();
    } else {
      toast.error("Failed to delete customers");
    }
  };

  const nextPage = () => {
    setPage((prev) => prev + 1);
  };

  const prevPage = () => {
    setPage((prev) => prev - 1);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Users className="w-5 h-4" />
          <h1>Customers</h1>
        </div>
        <div className="flex gap-2 mb-2">
          {selectRow.size > 0 && (
            <button
              onClick={handleDeleteCustomers}
              className="bg-red-600 text-white px-3 py-1 rounded-sm flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
              Delete ({selectRow.size})
            </button>
          )}
          <button
            onClick={() => router.push(`/dashboard/${storeslug}/customers/new`)}
            className="bg-[#06102c] text-white px-3 py-1 rounded-sm"
          >
            Add customer
          </button>
        </div>
      </div>
      <Card>
        <SearchInput
          icon={<Search className="text-gray-400 w-4 h-4 border-none" />}
          value={searchCustomer}
          onChange={(e) => setSearchCustomer(e.target.value)}
          placeholder="Search customers"
          className="border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
        />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    selectRow.size === filteredCustomers.length &&
                    filteredCustomers.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Customer name</TableHead>
              <TableHead>Email subscription</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Amount spent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-gray-500"
                >
                  {searchCustomer
                    ? "No customers found"
                    : "No customers yet. Create your first customer."}
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => (
                <TableRow
                  key={customer.id}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectRow.has(customer.id)}
                      onCheckedChange={() => handleSelectCustomers(customer.id)}
                    />
                  </TableCell>
                  <TableCell
                    onClick={() =>
                      router.push(
                        `/dashboard/${storeslug}/customers/${customer.id}`,
                      )
                    }
                  >
                    {customer.firstName} {customer.lastName}
                  </TableCell>
                  <TableCell
                    onClick={() =>
                      router.push(
                        `/dashboard/${storeslug}/customers/${customer.id}`,
                      )
                    }
                    className="font-medium"
                  >
                    {customer.subscribe ? "Subscribed" : "Not subscribed"}
                  </TableCell>
                  <TableCell
                    onClick={() =>
                      router.push(
                        `/dashboard/${storeslug}/customers/${customer.id}`,
                      )
                    }
                  >
                    -
                  </TableCell>
                  <TableCell
                    onClick={() =>
                      router.push(
                        `/dashboard/${storeslug}/customers/${customer.id}`,
                      )
                    }
                  >
                    {customer.orders?.length || 0}
                  </TableCell>
                  <TableCell
                    onClick={() =>
                      router.push(
                        `/dashboard/${storeslug}/customers/${customer.id}`,
                      )
                    }
                  >
                    ${customer.totalSpent || "0.00"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {customers.length > 0 && (
          <div className="flex gap-10 justify-center items-center py-4 border-t">
            <Button variant={"outline"} onClick={prevPage} disabled={page <= 1}>
              <ArrowLeft />
            </Button>
            <span className="text-sm text-gray-600">Page {page}</span>
            <Button variant={"outline"} onClick={nextPage}>
              <ArrowRight />
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CustomersPage;
