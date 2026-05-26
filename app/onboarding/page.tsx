"use client";

import { authClient } from "@/lib/authClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BUSINESS_TYPES, CURRENCIES } from "../constants/services";
import { generateDomain, generateSlug } from "@/lib/utils";
import { FormDataProps, User } from "@/types";
import { toast } from "sonner";
import { updateOnboardingUser } from "@/actions/onBoardingStatus";

const OnBoarding = () => {
  const [step, setStep] = useState(1);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<FormDataProps>({
    name: "",
    slug: "",
    shopDomain: "",
    logoUrl: "",
    businessType: "",
    currency: "AFG",
  });
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const session = await authClient.getSession();
      if (session?.data?.user.onboardingCompleted) {
        router.push("/dashboard");
      }
      // FIXED: Transform the user data to match User type
      const sessionUser = session?.data?.user;
      if (sessionUser) {
        setUser({
          id: sessionUser.id,
          name: sessionUser.name,
          email: sessionUser.email,
          image: sessionUser.image || undefined, // Convert null to undefined
          onboardingCompleted: sessionUser.onboardingCompleted,
        });
      } else {
        setUser(null);
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (formData.name) {
      const generatedDomain = generateDomain(formData.name);
      setFormData((prev) => ({
        ...prev,
        shopDomain: generatedDomain,
      }));
    }
  }, [formData.name]);

  useEffect(() => {
    if (formData.name) {
      const generatedSlug = generateSlug(formData.name);
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.name]);

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    const formDat = new FormData();
    formDat.append("image", file);

    try {
      const response = await fetch(
        "https://api.imgbb.com/1/upload?key=c9668feeda70f40e354b4e3ae6258cf8",
        {
          method: "POST",
          body: formDat,
        },
      );
      const data = await response.json();

      setFormData((prev) => ({ ...prev, logoUrl: data.data.url }));
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  async function handleCreateStore() {
    setIsCreating(true);
    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create store");
      }

      await updateOnboardingUser();
      // Inside handleCreateStore function, after successful creation
      toast.success(
        `Store created! View it at: ${data.slug}.xrow-app.vercel.app`,
      );

      // Reset form
      setFormData({
        name: "",
        slug: "",
        shopDomain: "",
        logoUrl: "",
        businessType: "",
        currency: "USD",
      });
      setPreviewUrl("");

      // Navigate to the new store
      router.push(`/dashboard/${data.slug}`);
    } catch (error) {
      console.error("Error creating store:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create the shop",
      );
    } finally {
      setIsCreating(false);
    }
  }

  if (step === 1) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white bg-[#06102c]">
        <div className="p-8 rounded-lg w-full max-w-2xl">
          <h1 className="text-6xl mb-2 text-center">Welcome, {user?.name}! </h1>
        </div>
        <div className="flex gap-8">
          <button
            onClick={handleNext}
            className="flex-1 bg-white/10 text-white px-6 py-2 rounded-md hover:bg-[#14224c]"
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white bg-[#06102c]">
        <div className="p-8 rounded-lg w-full max-w-3xl">
          <h1 className="text-center text-5xl font-semibold">
            Start your store in minutes
          </h1>
          <p className="mt-2 text-gray-400">
            Build your online business, customize your storefront, and start
            selling from one place.
          </p>
        </div>
        <div className="flex gap-8">
          <button
            onClick={handleBack}
            className="flex-1 bg-white/10 text-white px-6 py-2 rounded-md hover:bg-[#14224c]"
          >
            Back
          </button>

          <button
            onClick={handleNext}
            className=" bg-white/10 text-white px-6 py-2 rounded-md hover:bg-[#14224c]"
          >
            Create Store
          </button>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white bg-[#06102c]">
        <div className="p-8 rounded-lg w-full max-w-3xl">
          <h1 className="text-4xl font-semibold text-center mb-8">
            Create your store
          </h1>
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-3">
              {previewUrl && (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Logo preview"
                    className="w-24 h-24 object-cover rounded-full border-2 border-gray-400"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-[#06102c]"></div>
                </div>
              )}

              <div className="w-full">
                <input
                  onChange={handleFileUpload}
                  type="file"
                  accept="image/*"
                  className="w-full border rounded-lg border-gray-400 p-2 text-sm file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-white/10 file:text-white hover:file:bg-[#14224c]"
                />
                {formData.logoUrl && (
                  <p className="text-sm text-green-400 text-center mt-1">
                    ✓ Logo uploaded!
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm">What's the name of your store?</span>
              <input
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                type="text"
                placeholder="Store name"
                className="py-2 px-5 border rounded-lg border-gray-400 text-white"
              />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm">Store slug (auto-generated)</span>
              <input
                value={formData.slug}
                disabled
                type="text"
                placeholder="store-url"
                className="py-2 px-5 border rounded-lg border-gray-400 bg-gray-100 text-gray-600 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400">
                Your store URL: yourstore.com/{formData.slug || "store-name"}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm">Business type</span>
              <select
                value={formData.businessType}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    businessType: e.target.value,
                  }))
                }
                className="py-2 px-5 border rounded-lg border-gray-400 bg-[#06102c] text-white"
              >
                <option value="">Select business type</option>
                {BUSINESS_TYPES.map((type, i) => (
                  <option key={i} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm">Currency</span>
              <select
                value={formData.currency}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, currency: e.target.value }))
                }
                className="py-2 px-5 border rounded-lg border-gray-400 bg-[#06102c] text-white"
              >
                {CURRENCIES.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name} ({currency.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="flex gap-8 mt-8">
          <button
            onClick={handleBack}
            className="flex-1 bg-white/10 text-white px-6 py-2 rounded-md hover:bg-[#14224c]"
          >
            Back
          </button>
          <button
            onClick={handleCreateStore}
            disabled={isCreating}
            className="bg-white/10 text-white px-6 py-2 rounded-md hover:bg-[#14224c] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? "Creating..." : "Create Store"}
          </button>
        </div>
      </div>
    );
  }
};

export default OnBoarding;
