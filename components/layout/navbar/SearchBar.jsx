"use client";

import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export const SearchBar = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && query.trim()) {
      router.push(`/brands?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSearchClick = () => {
    if (query.trim()) {
      router.push(`/brands?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleClear = () => {
    setQuery("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="w-full relative flex items-center">
      <Search
        className="absolute left-3.5 h-4.5 w-4.5 text-slate-400 cursor-pointer hover:text-[#2563eb] transition-colors z-10"
        onClick={handleSearchClick}
      />
      <input
        ref={inputRef}
        type="text"
        placeholder="Search for brands, categories"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-slate-300 focus:shadow-md placeholder-slate-400 transition-all duration-200 shadow-xs"
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 transition-colors z-10 cursor-pointer bg-transparent border-0 flex items-center justify-center"
          aria-label="Clear search query"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
