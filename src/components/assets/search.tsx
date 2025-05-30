import { Search } from 'lucide-react'
import React from 'react'
import { Input } from '../ui/input'

const SearchBar = ({searchQuery,setSearchQuery}:{searchQuery:string,setSearchQuery:(data:string)=>void}) => {
  return (
    <div className="flex items-center gap-4 mb-6">
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        placeholder="Search by name, serial, manufacturer, model, or user..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10"
      />
    </div>
  </div>
  )
}

export default SearchBar
