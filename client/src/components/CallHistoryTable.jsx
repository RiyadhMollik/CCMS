import React, { useState, useEffect } from "react";

const CallHistoryTable = () => {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch call history data from API
  useEffect(() => {
    const fetchCalls = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://iinms.brri.gov.bd/api/cdr/report/all"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // console.log("Call History API Response:", data);

        // Get the last10History array from the API response
        const callsData = data.last10History || [];
        setCalls(Array.isArray(callsData) ? callsData : []);
      } catch (err) {
        console.error("Error fetching call history:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCalls();
  }, []);

  // Format date and time function
  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  // Format duration function (duration comes as string like "30s")
  const formatDuration = (duration) => {
    if (!duration) return "N/A";
    // Duration is already formatted as string like "30s", "1m 30s", etc.
    return duration;
  };

  // Clean source number by removing .0 at the end
  const cleanSource = (source) => {
    if (!source) return "N/A";
    // Remove .0 at the end if it exists
    return source.toString().replace(/\.0$/, "");
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          Recent Call History
        </h1>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <span className="ml-3 text-gray-600">Loading call history...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          Recent Call History
        </h1>
        <div className="text-center py-12">
          <div className="text-red-500 text-lg mb-2">
            Error loading call history
          </div>
          <div className="text-gray-600 text-sm">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <div className="flex justify-between mb-6">
        <h1 className="text-xl md:text-3xl font-bold text-gray-800">
          Recent Call History
        </h1>
        <div className="text-sm text-gray-500">
          Total: {calls.length} calls
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="table table-zebra w-full">
          <thead className="bg-gradient-to-r from-green-50 to-green-100 border-b border-gray-200">
            <tr className="text-sm md:text-base font-semibold text-gray-700">
              <th className="py-4 px-6">Date</th>
              <th className="py-4 px-4">Source</th>
              <th className="py-4 px-4">Destination</th>
              <th className="py-4 px-4 text-center">Status</th>
              <th className="py-4 px-4 text-center">Duration</th>
              <th className="py-4 px-4 text-center">Location</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {calls.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-12 text-center text-gray-500">
                  No call history available
                </td>
              </tr>
            ) : (
              calls.map((call, index) => (
                <tr
                  key={call.id || index}
                  className="bg-white hover:bg-green-50 transition-colors duration-200 ease-in-out"
                >
                  <td className="py-4 px-6 text-gray-800 font-medium">
                    <div className="flex items-center">
                      <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                        {formatDateTime(call.date)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-700">
                    0{cleanSource(call.source)}
                  </td>
                  <td className="py-4 px-4 text-gray-700">
                    {call.destination || "N/A"}
                  </td>
                  <td className="py-4 px-4 text-gray-700 text-center">
                    <span
                      className={`inline-flex items-center rounded-full text-sm px-2 py-1 font-medium ${
                        call.status === "ANSWERED"
                          ? "bg-green-800 text-white"
                          : call.status === "NO ANSWER" || call.status === "FAILED"
                          ? "bg-red-800 text-white"
                          : call.status === "BUSY"
                          ? "bg-yellow-800 text-black"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {call.status || "N/A"}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-700 text-center">
                    <span className="inline-flex items-center text-sm font-medium px-2 py-1 rounded-full">
                      {formatDuration(call.duration)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-700 text-center">
                    {call.address || "N/A"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CallHistoryTable;
