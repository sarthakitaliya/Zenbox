"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  const [categories, setCategories] = useState<Category[]>([
    { name: "", description: "" },
    { name: "", description: "" },
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const [checkingCategorys, setCheckingCategories] = useState(true);
  const { createCategories, checkCategories } = useCategoryStore();
  const {setError} = useUIStore();

  useEffect(() => {
    const checkIfUserHasCategories = async () => {
      const hasCategories: boolean = await checkCategories();
      if (hasCategories) {
        setError(
          "You already have categories set up. Redirecting to inbox..."
        );
        router.push("/mail/inbox");
      } else {
        setCheckingCategories(false);
      }
    };
    checkIfUserHasCategories();
  }, []);

  if (checkingCategorys) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 mx-auto"></div>
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
        setError("Failed to save categories. Please try again.");
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
      setError("Failed to skip categories. Please try again.");
    }
  };

  const currentCategory = categories[currentStep];
  const completedCategories = getCompletedCategories();
  const canSkip = completedCategories >= 2;
  const isLastStep = currentStep === categories.length - 1;

  return (
    <RequireAuth>
      <div className="min-h-screen bg-gray-900">
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
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
                  <div
                    style={{
                      width: `${((currentStep + 1) / Math.max(4, categories.length)) * 100}%`,
                    }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-400 transition-all duration-500"
                  />
                </div>
                <div className="flex justify-between">
                  {Array.from({ length: Math.max(4, categories.length) }).map(
                    (_, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-center w-8 h-8 rounded-full ${
                          index <= currentStep
                            ? "bg-indigo-500 text-gray-100"
                            : "bg-gray-700 text-gray-400"
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
            className="bg-gray-800 rounded-2xl shadow-xl p-8"
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
                  className="block w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 placeholder:text-gray-500 text-gray-100"
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
                  className="block w-full px-4 py-3 rounded-lg border border-gray-600 bg-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 placeholder:text-gray-500 text-gray-100"
                  placeholder="Describe what this category is for"
                />
              </div>

              <div className="flex justify-between items-center pt-6">
                <div>
                  {currentStep > 0 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="inline-flex items-center px-6 py-3 border border-gray-600 shadow-sm text-base font-medium rounded-lg text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
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
                      className="inline-flex items-center px-6 py-3 border border-gray-600 shadow-sm text-base font-medium rounded-lg text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                    >
                      Skip
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
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
