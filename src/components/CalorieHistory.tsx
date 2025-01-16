import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

interface Entry {
  date: string;
  name: string;
  final_rating: number;
  calories: number;
}

interface Groups {
  [key: string]: Entry[];
}

const CalorieHistory = () => {
  const { user } = useUser();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiUrl, setApiUrl] = useState<string>('');

  useEffect(() => {
    const getApiUrl = () => {
      if (process.env.NODE_ENV === 'development') {
        if (isMobileDevice()) {
          return 'http://192.168.1.3:5001';
        } else {
          return 'http://localhost:5001';
        }
      }
      return '/api';
    };

    setApiUrl(getApiUrl());
  }, []);

  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };


  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) {
        setError("User is not authenticated.");
        setLoading(false);
        return;
      }

      try {
        setError(null);
        setLoading(true);
        const response = await fetch(`${apiUrl}/get-history/${user.id}`);

        if (!response.ok) {
          console.error(`Error fetching history: ${response.statusText}`);
          throw new Error(`Failed to fetch history. Status: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched data:", data);

        const filteredData = data.filter(
          (item: any): item is Entry =>
            typeof item.date === "string" &&
            typeof item.name === "string" &&
            typeof item.final_rating === "number" &&
            typeof item.calories === "number"
        );

        setEntries(filteredData);
      } catch (fetchError) {
        console.error("Error fetching history:", fetchError);
        setError("Failed to load calorie history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user, apiUrl]);


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

  const handleDelete = async (entry: Entry) => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/delete-entry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          entryId: `${entry.date} ${entry.name}`
        })
      });
  
      if (!response.ok) {
        throw new Error(`Failed to delete entry. Status: ${response.statusText}`);
      }
      setEntries(prevEntries => prevEntries.filter(e => e.date !== entry.date && e.name !== entry.name));
  
      // Optionally, you can also refresh the entire history
      // fetchHistory(); // Call this function if you've defined it elsewhere
    } catch (deleteError) {
      console.error("Error deleting entry:", deleteError);
      setError("Failed to delete entry. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center">
        <p className="text-gray-600">Loading calorie history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

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
                  <div key={date} className="rounded-lg shadow-md bg-white">
                    <div className="p-4 border-b flex justify-between items-center">
                      <h3 className="font-semibold text-lg text-gray-800">
                        {new Date(date).toLocaleDateString()}
                      </h3>
                      <span className="text-lg font-bold text-green-600">
                        Total: {getTotalCalories(date).toFixed(1)} calories
                      </span>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div className="col-span-1 font-bold text-lg text-gray-800 text-center">Food Name</div>
                        <div className="col-span-1 font-bold text-lg text-gray-800 text-center">Final Rating</div>
                        <div className="col-span-1 font-bold text-lg text-gray-800 text-right">Calorie Count</div>
                        <div className="col-span-1 font-bold text-lg text-gray-800 text-right">Actions</div>
                      </div>
                      {dateEntries.map((entry, index) => (
                        <div key={index} className="grid grid-cols-4 gap-4 mt-2 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 transition duration-300 ease-in-out">
                          <div className="col-span-1 px-2 py-1 text-base text-gray-700 text-center truncate">{entry.name}</div>
                          <div className="col-span-1 px-2 py-1 text-base text-yellow-600 text-center">{entry.final_rating.toFixed(1)} / 10</div>
                          <div className="col-span-1 px-2 py-1 text-base text-green-600 text-right">{Math.round(entry.calories)} calories</div>
                          <div className="col-span-1 px-2 py-1 text-base text-red-600 text-right">
                            <button onClick={() => handleDelete(entry)} className="hover:underline">
                              Delete
                            </button>
                          </div>
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