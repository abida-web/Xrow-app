import {
  pgTable,
  text,
  timestamp,
  uuid,
  jsonb,
  boolean,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const store = pgTable("store", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  ownerId: text("owner_id")
    .references(() => user.id)
    .notNull(),
  shopDomain: text("shop_domain"),
  logoUrl: text("logo_url"),
  businessType: text("business_type"),
  currency: text("currency").default("AFG"),
  activeTheme: text("active_theme").default("modern"),
  status: text("status").default("active"),
  isPublished: boolean("is_published").default(false),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const storeMembers = pgTable("store_members", {
  id: uuid("id").defaultRandom().primaryKey(),
  storeId: uuid("store_id")
    .references(() => store.id, { onDelete: "cascade" })
    .notNull(),
  userId: text("user_id")
    .references(() => user.id)
    .notNull(),
  role: text("role").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const storeSettings = pgTable("store_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  storeId: uuid("store_id")
    .references(() => store.id, { onDelete: "cascade" })
    .notNull()
    .unique(),

  // Theme customization
  theme: text("theme").default("modern"),
  primaryColor: text("primary_color").default("#3B82F6"),
  secondaryColor: text("secondary_color").default("#10B981"),
  accentColor: text("accent_color").default("#F59E0B"),

  // Typography
  headingFont: text("heading_font").default("Inter"),
  bodyFont: text("body_font").default("Inter"),

  // Layout settings
  layout: jsonb("layout").$default(() => ({
    showAnnouncementBar: true,
    showSearchBar: true,
    productsPerRow: 4,
    sidebarPosition: "left",
  })),

  // Header/Hero settings
  heroTitle: text("hero_title").default("Welcome to our store"),
  heroSubtitle: text("hero_subtitle").default(
    "Amazing products at great prices",
  ),
  heroImage: text("hero_image").default("/default-hero.jpg"),
  heroButtonText: text("hero_button_text").default("Shop Now"),
  heroButtonLink: text("hero_button_link").default("/products"),

  // Announcement bar
  announcementText: text("announcement_text").default(
    "Free shipping on orders over $50!",
  ),
  announcementEnabled: boolean("announcement_enabled").default(true),

  // Social links
  socialLinks: jsonb("social_links").$default(() => ({
    facebook: "",
    instagram: "",
    twitter: "",
    tiktok: "",
  })),

  // SEO defaults
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),

  // Contact info
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  address: jsonb("address").$default(() => ({
    line1: "",
    line2: "",
    city: "",
    country: "",
    postalCode: "",
  })),

  updatedAt: timestamp("updated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});
