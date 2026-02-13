import { Funnel, ListFilter, Menu, RefreshCcw, Search, X } from "lucide-react";
import Toggle from "./Toggle";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCategoryStore, useEmailStore, useUIStore } from "@repo/store";

export const MailNavbar = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchText, setSearchText] = useState(searchParams.get("q") || "");

  const { fetchCategories, categories } = useCategoryStore();
  const { filterEmails } = useEmailStore();
  const { setSidebarOpen, sidebarOpen } = useUIStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const categoryFromURL = searchParams.get("category");
    if (categoryFromURL) {
      filterEmails(categoryFromURL);
    } else {
      filterEmails("all");
    }
  }, [searchParams, filterEmails]);

  useEffect(() => {
    setSearchText(searchParams.get("q") || "");
  }, [searchParams]);

  const updateQueryParams = ({
    category,
    query,
  }: {
    category?: string;
    query?: string;
  }) => {
    const threadId = searchParams.get("threadId");
    const nextCategory = category ?? searchParams.get("category") ?? "";
    const nextQuery = query ?? searchParams.get("q") ?? "";
    const params = new URLSearchParams();

    if (nextCategory) {
      params.set("category", nextCategory);
    }

    if (nextQuery.trim()) {
      params.set("q", nextQuery.trim());
    }

    if (threadId) {
      params.set("threadId", threadId);
    }

    const path = window.location.pathname;
    router.replace(params.toString() ? `${path}?${params.toString()}` : path);
  };

  const onCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateQueryParams({ category: e.target.value });
  };

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setSearchText(next);
    updateQueryParams({ query: next });
  };

  const clearSearch = () => {
    setSearchText("");
    updateQueryParams({ query: "" });
  };
  return (
    <div className="flex flex-col gap-2 bg-[#1A1A1A] sticky top-0 z-10">
      <div className="flex items-center justify-between p-5 border-b border-[#3f3f3f7a]">
        <div className="cursor-pointer">
          <Menu size={17} className="text-gray-400" onClick={() => setSidebarOpen(!sidebarOpen)} />
        </div>
        <div className="flex space-x-4 items-center">
          <Toggle />
          <div className="border-l h-4 border-[#75757562]" />
          <RefreshCcw className="cursor-pointer text-gray-400" size={17} />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 px-2 sm:px-5">
        <div className="relative w-full sm:flex-1 sm:max-w-[22vw]">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={15}
          />
          <input
            type="text"
            value={searchText}
            onChange={onSearchChange}
            placeholder="Search emails..."
            className="w-full pl-10 pr-8 py-1.5 rounded-md bg-[#141414] text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-600"
          />
          {searchText && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-gray-500 transition hover:bg-[#2a2a2a] hover:text-gray-200 cursor-pointer"
              aria-label="Clear search"
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="relative w-full sm:flex-1 sm:max-w-[22vw]">
          <ListFilter
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={15}
          />
          <select
            className="w-full pl-10 pr-3 py-1.5 rounded-md bg-[#141414] text-gray-200 appearance-none focus:outline-none cursor-pointer"
            onChange={onCategoryChange}
            value={searchParams.get("category") || ""}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
