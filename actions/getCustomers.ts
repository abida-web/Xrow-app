"use server";
import { db } from "@/drizzle/db";
import { customerAddresses, customers, store } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { Customer } from "@/types";
import { and, eq, inArray } from "drizzle-orm";
import { headers } from "next/headers";

export const getAllCustomers = async (storeslug: string, page: number) => {
  if (!storeslug) {
    throw new Error("storeslug is required");
  }

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }

  // Find store by slug
  const storeOwner = await db.query.store.findFirst({
    where: eq(store.slug, storeslug),
  });

  if (!storeOwner) {
    throw new Error("Store not found");
  }

  // Verify ownership
  if (storeOwner.ownerId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  const limit = 10;
  const offset = (page - 1) * limit;

  const customersList = await db.query.customers.findMany({
    where: eq(customers.storeId, storeOwner.id),
    with: {
      orders: true,
      addresses: true,
      giftCards: true,
    },
    offset,
    limit,
  });
  return customersList;
};
export const getCustomer = async (storeslug: string, customerId: string) => {
  if (!storeslug) {
    throw new Error("storeslug is required");
  }

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }

  // Find store by slug
  const storeOwner = await db.query.store.findFirst({
    where: eq(store.slug, storeslug),
  });

  if (!storeOwner) {
    throw new Error("Store not found");
  }

  // Verify ownership
  if (storeOwner.ownerId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  const customer = await db.query.customers.findFirst({
    where: and(
      eq(customers.storeId, storeOwner.id),
      eq(customers.id, customerId),
    ),
    with: {
      orders: true,
      addresses: true,
      giftCards: true,
    },
  });
  return customer;
};
export const deleteCustomers = async (
  storeslug: string,
  customersIds: string[],
) => {
  if (!storeslug) {
    throw new Error("storeslug is required");
  }

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }

  // Find store by slug
  const storeOwner = await db.query.store.findFirst({
    where: eq(store.slug, storeslug),
  });

  if (!storeOwner) {
    throw new Error("Store not found");
  }

  // Verify ownership
  if (storeOwner.ownerId !== session.user.id) {
    throw new Error("Unauthorized");
  }
  const deleteCus = await db
    .delete(customers)
    .where(
      and(
        inArray(customers.id, customersIds),
        eq(customers.storeId, storeOwner.id),
      ),
    );
  return { success: true };
};
interface UpdateCustomerData {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  note?: string | null;
}
export const editContactInformation = async (
  storeslug: string,
  customerId: string,
  data: UpdateCustomerData,
) => {
  if (!storeslug) {
    throw new Error("storeslug is required");
  }

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }

  // Find store by slug
  const storeOwner = await db.query.store.findFirst({
    where: eq(store.slug, storeslug),
  });

  if (!storeOwner) {
    throw new Error("Store not found");
  }

  // Verify ownership
  if (storeOwner.ownerId !== session.user.id) {
    throw new Error("Unauthorized");
  }
  const update = await db
    .update(customers)
    .set({
      firstName: data.firstName,
      email: data.email ?? "",
      lastName: data.lastName,
      phone: data.phone,
      note: data.note,
      updatedAt: new Date(),
    })
    .where(
      and(eq(customers.storeId, storeOwner.id), eq(customers.id, customerId)),
    )
    .returning();
  return update;
};
interface EditeAddressProps {
  addresses: Array<{
    address1: string;
    address2: string;
    city: string;
    zip: string;
    postalCode: string;
    country: string;
    customerId: string;
  }>;
}

export const editAddressInformation = async (
  storeslug: string,
  customerId: string,
  data: EditeAddressProps,
) => {
  if (!storeslug) {
    throw new Error("storeslug is required");
  }

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }

  // Find store by slug
  const storeOwner = await db.query.store.findFirst({
    where: eq(store.slug, storeslug),
  });

  if (!storeOwner) {
    throw new Error("Store not found");
  }

  // Verify ownership
  if (storeOwner.ownerId !== session.user.id) {
    throw new Error("Unauthorized");
  }
  const addresses = data.addresses.map((ad) => ({
    address1: ad.address1,
    address2: ad.address2,
    city: ad.city,
    zip: ad.zip,
    postalCode: ad.postalCode,
    country: ad.country,
  }));
  // Update the customer with new addresses
  const updatedCustomer = await db
    .update(customerAddresses)
    .set({
      addressLineOne: addresses[0].address1,
    })
    .where(
      and(eq(customers.storeId, storeOwner.id), eq(customers.id, customerId)),
    )
    .returning();

  return updatedCustomer[0];
};
