import React, { useState, useEffect } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";

const HistoryPage: React.FC = () => {
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistoryData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:5000/api/history");
        if (response.ok) {
          const data = await response.json();
          setHistoryData(data);
        } else {
          throw new Error("Failed to fetch history data.");
        }
      } catch (error:any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryData();
  }, []);

  const filteredData = historyData
    .filter(
      (item) =>
        item.foodName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.finalRating.toString().includes(searchTerm)
    )
    .sort((a, b) => {
      if (sortField) {
        const valueA = a[sortField];
        const valueB = b[sortField];
        if (sortOrder === "asc") return valueA > valueB ? 1 : -1;
        else return valueA < valueB ? 1 : -1;
      }
      return 0;
    });

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const renderSortIcon = (field: string) => {
    if (field !== sortField) return null;
    return sortOrder === "asc" ? <ChevronUp className="inline w-4 h-4" /> : <ChevronDown className="inline w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-emerald-800 mb-4">Nutrition Scan History</h1>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <div className="relative mb-4 sm:mb-0">
            <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by food or rating..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-80 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button
            onClick={() => setSortField("")}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Reset Sort
          </button>
        </div>

        {loading && <p className="text-center text-gray-500">Loading history...</p>}
        {error && <p className="text-center text-red-500">Error: {error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full text-sm text-gray-800">
              <thead className="bg-gray-100">
                <tr>
                  <th onClick={() => handleSort("foodName")} className="cursor-pointer py-3 px-4 text-left">
                    Food Name {renderSortIcon("foodName")}
                  </th>
                  <th onClick={() => handleSort("finalRating")} className="cursor-pointer py-3 px-4 text-left">
                    Final Rating {renderSortIcon("finalRating")}
                  </th>
                  <th onClick={() => handleSort("timestamp")} className="cursor-pointer py-3 px-4 text-left">
                    Timestamp {renderSortIcon("timestamp")}
                  </th>
                  <th className="py-3 px-4 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{item.foodName}</td>
                    <td className="py-2 px-4">{item.finalRating}</td>
                    <td className="py-2 px-4">{new Date(item.timestamp).toLocaleString()}</td>
                    <td className="py-2 px-4">{item.description}</td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-gray-500">
                      No history found. Start your first scan now!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
