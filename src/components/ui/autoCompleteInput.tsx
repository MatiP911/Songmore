import React, { useEffect, useState, useRef } from "react";
import { Input } from "./input.tsx";
import { Search } from "lucide-react";
import type { track } from "../../app/api/random-song/interfaces.tsx";

type Props = {
  value: string;
  onChange: (val: string) => void;
};

export function AutoCompleteInput({ value, onChange }: Props) {
  const [suggestions, setSuggestions] = useState<track[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const suppressFetchRef = useRef(false);

  const fetchSuggestions = async (query: string) => {
    if (!query) return setSuggestions([]);
    try {
      const encodedQuery = encodeURIComponent(query);
      const res = await fetch(`/api/search?q=${encodedQuery}`);
      const data = await res.json();
      setSuggestions(data.data?.slice(0, 10) || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  useEffect(() => {
    if (suppressFetchRef.current) {
      suppressFetchRef.current = false;
      return;
    }
    const delayDebounce = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [value]);

  return (
    <div className="w-full relative">
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-0 translate-y-[-110%] w-full bg-gray-900 text-white border border-gray-700 rounded shadow-md max-h-64 overflow-y-auto z-50 scrollbar-hide">
          {suggestions.map((s) => (
            <div
              key={s.id}
              className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
              onClick={() => {
                suppressFetchRef.current = true;
                onChange(`${s.title} - ${s.artist.name}`);
                setShowSuggestions(false);
              }}
            >
              {s.title} – {s.artist.name}
            </div>
          ))}
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <Input
          type="text"
          placeholder="Know it? Search for the title"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setShowSuggestions(true);
          }}
          className="pl-10 bg-gray-900 border-gray-700 text-white rounded-md"
        />
      </div>
    </div>
  );
}
