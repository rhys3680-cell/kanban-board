interface MemoFiltersProps {
  searchQuery: string;
  selectedDate: string;
  onSearchChange: (query: string) => void;
  onDateChange: (date: string) => void;
}

export function MemoFilters({
  searchQuery,
  selectedDate,
  onSearchChange,
  onDateChange,
}: MemoFiltersProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Filters</h3>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <input
            type="text"
            placeholder="Search by title or content..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
          />
        </div>
        {(searchQuery || selectedDate) && (
          <button
            onClick={() => {
              onSearchChange("");
              onDateChange("");
            }}
            className="w-full py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-medium"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}
