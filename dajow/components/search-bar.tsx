"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { useState, useEffect } from "react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const initialQuery = searchParams.get("q") ?? ""
  const [query, setQuery] = useState(initialQuery)

  // Keep input synced with URL
  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()

    if (!query.trim()) return

    router.push(`/products?q=${encodeURIComponent(query)}`)
  }

  return (
    <form onSubmit={handleSearch} className="relative flex w-full">
      <Input
        type="search"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pr-10"
      />
      <Button
        type="submit"
        size="icon"
        variant="ghost"
        className="absolute right-1 top-1/2 -translate-y-1/2"
      >
        <Search className="h-4 w-4" />
      </Button>
    </form>
  )
}
