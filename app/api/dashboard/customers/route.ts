import { db } from "@/drizzle/db";
import { customerAddresses, customers } from "@/drizzle/schema";
import { getVerifiedStoreBySlug } from "@/lib/store-utils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { extendedCustomerForm, storeslug } = await request.json();
  if (!storeslug) {
    return NextResponse.json(
      { error: "storeslug is required" },
      { status: 400 },
    );
  }

  const storeOwner = await getVerifiedStoreBySlug(storeslug);
  const [newCustomer] = await db
    .insert(customers)
    .values({
      email: extendedCustomerForm.email,
      phone: extendedCustomerForm.phone,
      subscribe: false,
      firstName: extendedCustomerForm.firstName,
      lastName: extendedCustomerForm.lastName,
      note: extendedCustomerForm.note ?? null,
      storeId: storeOwner.id,
    })
    .returning();
  const customerAddress = await db
    .insert(customerAddresses)
    .values({
      customerId: newCustomer.id,
      country: extendedCustomerForm.country,
      city: extendedCustomerForm.city,
      addressLineOne: extendedCustomerForm.address1,
      addressLineTwo: extendedCustomerForm.address2 ?? null,
      postalCode: extendedCustomerForm.postalCode,
      zip: extendedCustomerForm.zip ?? null,
      acceptsMarketing: extendedCustomerForm.acceptsMarketing,
    })
    .returning();
  return NextResponse.json({ success: true }, { status: 201 });
}
