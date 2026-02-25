"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { RequireAuth } from "@/components/RequireAuth";
import { useCategoryStore, useUIStore } from "@repo/store";
import { CategoryIconPicker } from "@/components/mail/CategoryIconPicker";

interface Category {
  name: string;
  description: string;
  icon?: string;
}

export default function SetupCategories() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasShownAccessToast = useRef(false);
  const [categories, setCategories] = useState<Category[]>([
    { name: "", description: "" },
    { name: "", description: "" },
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const [checkingCategorys, setCheckingCategories] = useState(true);
  const { createCategories, checkCategories } = useCategoryStore();
  const {setError} = useUIStore();

  useEffect(() => {
    const reason = searchParams.get("reason");
    if (reason !== "missing-categories" || hasShownAccessToast.current) return;

    hasShownAccessToast.current = true;
    setError("You need to set up categories before using the mail feature.");
    router.replace("/setup-categories");
  }, [router, searchParams, setError]);

  useEffect(() => {
    let isMounted = true;

    const checkIfUserHasCategories = async () => {
      const hasCategories = await checkCategories(false);
      if (!isMounted) return;

      if (hasCategories === true) {
        router.push("/mail/inbox");
      } else {
        setCheckingCategories(false);
      }
    };

    checkIfUserHasCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  if (checkingCategorys) {
    return (
      <div className="min-h-screen bg-[#111112] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-300 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  const updateCategory = (field: keyof Category, value: string) => {
    const newCategories = [...categories];
    newCategories[currentStep][field] = value;
    setCategories(newCategories);
  };

  const validateCurrentCategory = () => {
    const current = categories[currentStep];
    if (!current.name.trim() || !current.description.trim() || !current.icon?.trim()) {
      setError("Please fill in all fields for this category");
      return false;
    }
    setError("");
    return true;
  };

  const getCompletedCategories = () => {
    return categories.filter((cat) => cat.name.trim() && cat.description.trim())
      .length;
  };

  const handleNext = async () => {
    if (!validateCurrentCategory()) return;

    if (currentStep < categories.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (categories.length < 4) {
      setCategories([...categories, { name: "", description: "" }]);
      setCurrentStep(currentStep + 1);
    } else {
      try {
        const completedCategories = categories.filter(
          (cat) => cat.name.trim() && cat.description.trim() && cat.icon?.trim()
        );

        await createCategories(completedCategories);
        router.push("/mail/inbox");
      } catch (error) {
        console.error("Failed to save categories", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to save categories. Please try again."
        );
      }
    }
  };

  const handleSkip = async () => {
    if (getCompletedCategories() < 2) {
      setError("Please complete at least 2 categories before skipping");
      return;
    }
    try {
      const completedCategories = categories.filter(
        (cat) => cat.name.trim() && cat.description.trim() && cat.icon?.trim()
      );
      await createCategories(completedCategories);
      router.push("/mail/inbox");
    } catch (error) {
      console.error("Failed to skip categories", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to skip categories. Please try again."
      );
    }
  };

  const currentCategory = categories[currentStep];
  const completedCategories = getCompletedCategories();
  const canSkip = completedCategories >= 2;
  const isLastStep = currentStep === categories.length - 1;

  return (
    <RequireAuth>
      <div className="min-h-screen bg-[#111112]">
        <div className="max-w-2xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-100 mb-4">
              Organize Your Emails
            </h1>
            <p className="text-lg text-gray-300 max-w-md mx-auto">
              Create at least 2 categories to organize your emails. You can add
              up to 4 categories.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              {completedCategories} of {categories.length} categories completed
            </p>

            <div className="mt-8 max-w-md mx-auto">
              <div className="relative">
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-[#2A2A2E]">
                  <div
                    style={{
                      width: `${((currentStep + 1) / Math.max(4, categories.length)) * 100}%`,
                    }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gray-300 transition-all duration-500"
                  />
                </div>
                <div className="flex justify-between">
                  {Array.from({ length: Math.max(4, categories.length) }).map(
                    (_, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-center w-8 h-8 rounded-full ${
                          index <= currentStep
                            ? "bg-[#2b2b30] text-gray-100 border border-[#3a3a40]"
                            : "bg-[#1A1A1D] text-gray-500 border border-[#2A2A2E]"
                        }`}
                      >
                        {index + 1}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-[#171718] border border-[#2A2A2E] rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-xl font-semibold text-gray-100 mb-6">
              Add Category {currentStep + 1}
            </h2>

            <div className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Icon
                </label>

                  <CategoryIconPicker
                    value={currentCategory.icon ?? ""}
                    onChange={(icon) => {
                      updateCategory("icon", icon);
                      console.log(icon);
                    }}
                  />

                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300 mb-2 mt-4"
                >
                  Category Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={currentCategory.name}
                  onChange={(e) => updateCategory("name", e.target.value)}
                  className="block w-full px-4 py-3 rounded-lg border border-[#323238] bg-[#111112] focus:ring-1 focus:ring-[#4a4a52] focus:border-[#4a4a52] transition-colors duration-200 placeholder:text-gray-500 text-gray-100"
                  placeholder="e.g., Work, Personal, Finance"
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={currentCategory.description}
                  onChange={(e) => updateCategory("description", e.target.value)}
                  rows={3}
                  className="block w-full px-4 py-3 rounded-lg border border-[#323238] bg-[#111112] focus:ring-1 focus:ring-[#4a4a52] focus:border-[#4a4a52] transition-colors duration-200 placeholder:text-gray-500 text-gray-100"
                  placeholder="Describe what this category is for"
                />
              </div>

              <div className="flex justify-between items-center pt-6">
                <div>
                  {currentStep > 0 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="inline-flex items-center px-6 py-3 border border-[#3a3a40] shadow-sm text-base font-medium rounded-lg text-gray-200 bg-[#222226] hover:bg-[#2b2b30] focus:outline-none transition-colors duration-200 cursor-pointer"
                    >
                      Back
                    </button>
                  )}
                </div>
                <div className="space-x-4">
                  {canSkip && (
                    <button
                      type="button"
                      onClick={handleSkip}
                      className="inline-flex items-center px-6 py-3 border border-[#3a3a40] shadow-sm text-base font-medium rounded-lg text-gray-200 bg-[#222226] hover:bg-[#2b2b30] focus:outline-none transition-colors duration-200 cursor-pointer"
                    >
                      Skip
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center px-6 py-3 border border-[#3a3a40] text-base font-medium rounded-lg shadow-sm text-gray-100 bg-[#2b2b30] hover:bg-[#3a3a40] focus:outline-none transition-colors duration-200 cursor-pointer"
                  >
                    {isLastStep ? "Save" : "Next"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </RequireAuth>
  );
}
