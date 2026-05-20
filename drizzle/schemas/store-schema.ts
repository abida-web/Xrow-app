
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const store = pgTable("store",{  
id:uuid("id").defaultRandom().primaryKey(),
name:text("name"),
slug:text("slug").unique(),
ownerId:text("owner_id" ).references(()=>user.id),
currency:text("currency").default("AFG"),
updatedAt:timestamp("updated_at").defaultNow()  
})
export  const storeMembers = pgTable("store_members",{
    id:uuid("id").defaultRandom().primaryKey(),
    storeId:uuid("store_id").references(()=>store.id),
    userId:uuid("user_id").references(()=>user.id),
    role:text("role"),
    createdAt:timestamp("created_at").defaultNow(),
})  