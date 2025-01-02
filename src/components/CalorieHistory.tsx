import { useState, useEffect } from 'react';

interface Entry {
  date: string;
  name: string;
  final_rating:number
  calories: number;
}

interface Groups {
  [key: string]: Entry[];
}

const CalorieHistory = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchHistory = async () => {
      if (!userId) return;
      try {
        const response = await fetch(`http://localhost:5001/get-history/${userId}`);
        if (!response.ok) {
          console.error(`Error fetching history: ${response.statusText}`);
          throw new Error("Failed to fetch history");
        }
        console.log('Response:', response);
        const data = await response.json();
        console.log('Fetched data:', data);
        const filteredData = data.filter((item:any): item is Entry => 
          typeof item.date === 'string' && typeof item.name === 'string' && typeof item.final_rating === 'number' && typeof item.calories === 'number'
        );
        console.log('Filtered data:', filteredData);
        setEntries(filteredData);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };
    fetchHistory();
  }, []);

  const getTotalCalories = (date: string) => {
    return entries
      .filter((entry) => entry.date === date)
      .reduce((sum, entry) => sum + entry.calories, 0);
  };

  const groupedEntries = entries.reduce<Groups>((groups, entry) => {
    if (!groups[entry.date]) groups[entry.date] = [];
    groups[entry.date].push(entry);
    return groups;
  }, {});

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="border border-gray-200 rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Calorie History</h2>
        </div>
        <div className="p-4">
          {Object.entries(groupedEntries).length === 0 ? (
            <p className="text-center text-gray-600">No Food Data Yet. Upload to show history.</p>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedEntries)
                .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
                .map(([date, dateEntries]) => (
                  <div key={date} className="space-y-2">
                    <div className="flex justify-between items-center border-b pb-2 bg-gray-100">
                      <h3 className="font-semibold text-lg text-gray-800">
                        {new Date(date).toLocaleDateString()}
                      </h3>
                      <span className="text-lg font-bold text-green-600">
                        {getTotalCalories(date)} calories
                      </span>
                    </div>
                    <div className="space-y-2 pl-4">
                      {dateEntries.map((entry, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-blue-100 rounded">
                          <span className="font-medium text-gray-800">{entry.name}</span>
                          <span className="text-gray-600">{entry.calories} calories</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalorieHistory;
