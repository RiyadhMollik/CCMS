import React, { useEffect, useState, useRef } from "react";
import {
  FaAngleDoubleLeft,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleRight,
  FaFileCsv,
  FaFilePdf,
} from "react-icons/fa";
import { Parser } from "@json2csv/plainjs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "/logo.png";
import bookAntiqua from "/bookantiqua.ttf";
const CdrTable = () => {
  const [cdrData, setCdrData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [filters, setFilters] = useState({
    destination: "",
    status: "",
    source: "",
    location: "",
    problem: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
  });
  const tableRef = useRef(null);

  const columns = [
    { name: "Date", visible: true },
    { name: "Source", visible: true },
    { name: "Destination", visible: true },
    // { name: "Src. Channel", visible: true },
    // { name: "Dst. Channel", visible: true },
    { name: "Status", visible: true },
    { name: "Duration", visible: true },
    { name: "Location", visible: true },
    { name: "Problem", visible: true },
  ];

  const columnKeyMap = {
    Date: "date",
    Source: "source",
    Destination: "destination",
    // "Src. Channel": "src_channel",
    // "Dst. Channel": "dst_channel",
    Status: "status",
    Duration: "duration",
    Location: "name",
    Problem: "address",
  };

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 10,
        ...filters,
      });
      const res = await fetch(`https://saads.brri.gov.bd/api/cdr?${params}`);
      const result = await res.json();

      // Filter out calls with destination "s"
      const filteredData = result.data.filter(
        (item) => item.destination !== "s"
      );
      setCdrData(filteredData);
      setPagination(result.pagination);
    } catch (err) {
      console.error("Failed to fetch CDR data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = async (id, field, value) => {
    setCdrData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
    try {
      await fetch(`https://saads.brri.gov.bd/api/cdr/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchData(newPage);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchData(1);
  };

  // Clean source number by removing .0 at the end
  const cleanSource = (source) => {
    if (!source) return "N/A";
    return source.toString().replace(/\.0$/, "");
  };

  // Format status text to proper case
  const formatStatus = (status) => {
    if (!status) return "N/A";
    const statusLower = status.toLowerCase();
    if (statusLower === "answered" || statusLower === "no answer") {
      return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    }
    return status.toUpperCase();
  };

  // Format date safely
  const formatDate = (dateString, options = {}) => {
    if (!dateString) return "N/A";

    try {
      let date;

      // Handle different date formats
      if (dateString.includes("Z") || dateString.includes("+")) {
        // Already has timezone info
        date = new Date(dateString);
      } else {
        // Assume UTC if no timezone info
        date = new Date(dateString + "Z");
      }

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }

      return date.toLocaleString("en-US", {
        timeZone: "UTC",
        ...options,
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid Date";
    }
  };

  const handleExportCSV = () => {
    try {
      const visibleColumns = columns.filter((col) => col.visible);

      const fields = visibleColumns.map((col) => ({
        label: col.name,
        value: col.name.toLowerCase().replace(/\s+/g, ""),
      }));

      const data = cdrData.map((row, index) => {
        const rowData = {};
        visibleColumns.forEach((col) => {
          const keyAlias = col.name.toLowerCase().replace(/\s+/g, "");
          const actualKey = columnKeyMap[col.name];
          if (col.name === "Date") {
            rowData[keyAlias] = formatDate(row.date, {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            });
          } else if (col.name === "Source") {
            rowData[keyAlias] = cleanSource(row[actualKey]);
          } else if (col.name === "Location") {
            rowData[keyAlias] = row.name || "";
          } else if (col.name === "Problem") {
            rowData[keyAlias] = row.address || "";
          } else {
            rowData[keyAlias] = actualKey ? row[actualKey] || "" : "";
          }
        });
        return rowData;
      });

      const json2csvParser = new Parser({ fields });
      const csv = json2csvParser.parse(data);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "call_history.csv";
      link.click();
    } catch (error) {
      console.error("CSV export failed:", error);
      alert("Failed to export CSV. Please try again.");
    }
  };

  const handleExportPDF = async () => {
    try {
      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 12;
      const loadFont = async (url) => {
        const response = await fetch(url);
        const buffer = await response.arrayBuffer();
        const base64 = btoa(
          new Uint8Array(buffer).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );
        return base64;
      };

      const bookAntiquaBase64 = await loadFont(bookAntiqua);

      // Register the font with jsPDF
      doc.addFileToVFS("Book-Antiqua.ttf", bookAntiquaBase64);
      doc.addFont("Book-Antiqua.ttf", "BookAntiqua", "normal");
      doc.setFont("BookAntiqua", "normal");
      doc.setFontSize(12);

      const visibleColumns = columns.filter((col) => col.visible);

      const headers = visibleColumns.map((col) => col.name);

      const data = cdrData.map((row) =>
        visibleColumns.map((col) => {
          const key = columnKeyMap[col.name];
          if (col.name === "Date") {
            return formatDate(row.date, {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            });
          } else if (col.name === "Source") {
            return cleanSource(row[key]);
          } else if (col.name === "Location") {
            return row.name || "";
          } else if (col.name === "Problem") {
            return row.address || "";
          }
          return key ? row[key] || "" : "";
        })
      );
      autoTable(doc, {
        startY: 40,
        head: [headers],
        body: data,
        theme: "grid",
        styles: {
          font: "BookAntiqua",
          fontSize: 5,
          cellPadding: 2,
          textColor: [50, 50, 50],
          overflow: "linebreak",
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: "bold",
          halign: "center",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        margin: { top: 40, left: margin, right: margin, bottom: 20 },
        didDrawPage: (data) => {
          doc.addImage(logo, "PNG", margin, 15, 15, 15);
          doc.setFontSize(10);
          doc.setTextColor(50);
          doc.setFont("BookAntiqua", "bold");
          doc.text(
            "Agrometeorology, Crop Modeling and Climate Change Research Laboratory (Agromet Lab)",
            margin + 18,
            15
          );
          doc.text(
            "Bangladesh Rice Research Institute (BRRI), Gazipur-1701",
            margin + 18,
            20
          );
          doc.setFontSize(10);
          doc.setTextColor(50);
          doc.setFont("BookAntiqua", "normal");
          doc.text("Email: info.brriagromet@gmail.com", margin + 18, 25);
          doc.text("Hotline: 09644300300", margin + 18, 35);
          doc.text("Website: ccms.brri.gov.bd", margin + 18, 30);

          const date = new Date();
          const formattedDate = date.toLocaleString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
          doc.setFont("BookAntiqua", "normal");
          doc.text(formattedDate, pageWidth - margin, 35, { align: "right" });

          const pageCount = doc.internal.getNumberOfPages();
          doc.setFontSize(8);
          doc.setTextColor(100);
          doc.text(
            `Page ${data.pageNumber} of ${pageCount}`,
            pageWidth / 2,
            pageHeight - 12,
            { align: "center" }
          );
          doc.text(
            "© 2025 Smart Agro-Advisory Dissemination System.",
            margin,
            pageHeight - 6
          );
          doc.text("Generated by: Admin", pageWidth - margin, pageHeight - 6, {
            align: "right",
          });
        },
      });

      doc.save("call_history.pdf");
    } catch (error) {
      console.error("PDF export failed:", error);
      alert("Failed to export PDF. Please try again.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-6">
      <div className="w-full bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
        {/* Header Section with Better Visual Hierarchy */}
        <div className="border-b border-gray-100 pb-4 sm:pb-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-1 h-6 sm:h-8 bg-green-600 rounded-full"></div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                  Call Data Records
                </h1>
              </div>
            </div>

            <div className="flex flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={handleExportCSV}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-green-600 text-white rounded-lg sm:rounded-xl font-medium shadow-md hover:bg-green-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm sm:text-base"
                title="Export to CSV"
              >
                <FaFileCsv size={16} className="sm:w-[18px] sm:h-[18px]" />
                Export CSV
              </button>
              <button
                onClick={handleExportPDF}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-red-600 text-white rounded-lg sm:rounded-xl font-medium shadow-md hover:bg-red-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm sm:text-base"
                title="Export to PDF"
              >
                <FaFilePdf size={16} className="sm:w-[18px] sm:h-[18px]" />
                Export PDF
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Filters Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
            <h3 className="text-lg font-semibold text-gray-800">
              Advanced Filters
            </h3>
            <div className="flex-1 h-px bg-gray-200 ml-4"></div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <form onSubmit={handleFilterSubmit} className="space-y-3">
              {/* First Row - Date Range, Time Range and Primary Filters */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-9 gap-2 sm:gap-3">
                <div className="relative">
                  <input
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-sm text-sm"
                  />
                  <label className="absolute -top-2 left-2 px-1 bg-white text-xs font-medium text-gray-500">
                    From Date
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-sm text-sm"
                  />
                  <label className="absolute -top-2 left-2 px-1 bg-white text-xs font-medium text-gray-500">
                    To Date
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="time"
                    name="startTime"
                    value={filters.startTime}
                    onChange={handleFilterChange}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-sm text-sm"
                  />
                  <label className="absolute -top-2 left-2 px-1 bg-white text-xs font-medium text-gray-500">
                    From Time
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="time"
                    name="endTime"
                    value={filters.endTime}
                    onChange={handleFilterChange}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-sm text-sm"
                  />
                  <label className="absolute -top-2 left-2 px-1 bg-white text-xs font-medium text-gray-500">
                    To Time
                  </label>
                </div>
                <input
                  type="text"
                  name="source"
                  value={filters.source}
                  onChange={handleFilterChange}
                  placeholder="Source"
                  className="p-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-sm text-sm"
                />
                <div className="relative">
                  <select
                    name="destination"
                    value={filters.destination}
                    onChange={handleFilterChange}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-sm text-sm appearance-none cursor-pointer"
                  >
                    <option value="">All Destinations</option>
                    <option value="100">100</option>
                    <option value="101">101</option>
                    <option value="102">102</option>
                    <option value="103">103</option>
                    <option value="104">104</option>
                    <option value="105">105</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                <div className="relative">
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-sm text-sm appearance-none cursor-pointer"
                  >
                    <option value="">All Status</option>
                    <option value="answered">Answered</option>
                    <option value="no answer">No Answer</option>
                    <option value="busy">Busy</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                <input
                  type="text"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  placeholder="Location"
                  className="p-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-sm text-sm"
                />
                <input
                  type="text"
                  name="problem"
                  value={filters.problem}
                  onChange={handleFilterChange}
                  placeholder="Problem"
                  className="p-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-sm text-sm"
                />
              </div>

              {/* Second Row - Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium shadow-md hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Apply Filters
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFilters({
                      destination: "",
                      status: "",
                      source: "",
                      location: "",
                      problem: "",
                      startDate: "",
                      endDate: "",
                      startTime: "",
                      endTime: "",
                    });
                    fetchData(1);
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 text-sm"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Clear All
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-green-600"></div>
            <span className="ml-3 text-gray-600 text-sm sm:text-base">
              Loading call data...
            </span>
          </div>
        ) : cdrData.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="text-gray-500 text-base sm:text-lg mb-2">
              No call data found
            </div>
            <div className="text-gray-400 text-sm">
              Try adjusting your filters or check back later
            </div>
          </div>
        ) : (
          <div
            className="overflow-x-auto rounded-lg border border-gray-200 -mx-1 sm:mx-0"
            ref={tableRef}
          >
            <table className="table table-zebra w-full min-w-[800px]">
              <thead className="bg-green-50 border-b border-gray-200">
                <tr className="text-xs sm:text-sm md:text-base font-semibold text-gray-700">
                  <th className="py-3 sm:py-4 px-3 sm:px-6">Date</th>
                  <th className="py-3 sm:py-4 px-2 sm:px-4">Source</th>
                  <th className="py-3 sm:py-4 px-2 sm:px-4">Destination</th>
                  {/* <th className="py-3 sm:py-4 px-2 sm:px-4 hidden sm:table-cell">
                    Src. Channel
                  </th> */}
                  {/* <th className="py-3 sm:py-4 px-2 sm:px-4 hidden sm:table-cell">
                    Dst. Channel
                  </th> */}
                  <th className="py-3 sm:py-4 px-2 sm:px-4 text-center">
                    Status
                  </th>
                  <th className="py-3 sm:py-4 px-2 sm:px-4 text-center">
                    Duration
                  </th>
                  <th className="py-3 sm:py-4 px-2 sm:px-4 text-center hidden md:table-cell">
                    Location
                  </th>
                  <th className="py-3 sm:py-4 px-2 sm:px-4 text-center hidden md:table-cell">
                    Problem
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cdrData.map((row) => (
                  <tr
                    key={row.id}
                    className="bg-white hover:bg-green-50 transition-colors duration-200 ease-in-out"
                  >
                    <td className="py-3 sm:py-4 px-3 sm:px-6 text-gray-800 font-medium">
                      <div className="flex flex-col">
                        <span className="text-xs sm:text-sm font-semibold text-gray-900">
                          {formatDate(row.date, {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                          })}
                        </span>
                        <span className="text-xs text-gray-600 mt-1">
                          {formatDate(row.date, {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-gray-700 text-xs sm:text-sm">
                      0{cleanSource(row.source)}
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-gray-700 text-xs sm:text-sm text-center">
                      {row.destination}
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-gray-700 text-center">
                      <span
                        className={`inline-flex items-center rounded-full text-xs px-2 py-1 font-medium whitespace-nowrap ${
                          (row.status || "").toLowerCase() === "answered"
                            ? "bg-green-800 text-white"
                            : (row.status || "").toLowerCase() === "no answer"
                            ? "bg-red-800 text-white"
                            : (row.status || "").toLowerCase() === "busy"
                            ? "bg-yellow-800 text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {formatStatus(row.status)}
                      </span>
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-gray-700 text-center">
                      <span className="inline-flex items-center text-xs sm:text-sm font-medium px-2 py-1 rounded-full">
                        {row.duration}
                      </span>
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-center hidden md:table-cell">
                      <input
                        type="text"
                        className="w-full p-1.5 sm:p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-xs sm:text-sm"
                        value={row.name || ""}
                        onChange={(e) =>
                          handleInputChange(row.id, "name", e.target.value)
                        }
                        placeholder="Location"
                      />
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-center hidden md:table-cell">
                      <input
                        type="text"
                        className="w-full p-1.5 sm:p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-xs sm:text-sm"
                        value={row.address || ""}
                        onChange={(e) =>
                          handleInputChange(row.id, "address", e.target.value)
                        }
                        placeholder="Problem"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center mt-6 sm:mt-8 gap-1 sm:gap-2">
          <button
            aria-label="First Page"
            className="p-1.5 sm:p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm"
            onClick={() => handlePageChange(1)}
            disabled={pagination.page <= 1}
          >
            <FaAngleDoubleLeft
              size={12}
              className="sm:w-4 sm:h-4 text-gray-600"
            />
          </button>
          <button
            aria-label="Previous Page"
            className="p-1.5 sm:p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
          >
            <FaAngleLeft size={12} className="sm:w-4 sm:h-4 text-gray-600" />
          </button>

          <div className="flex items-center gap-1 sm:gap-2 bg-white border border-gray-200 rounded-lg px-2 sm:px-3 py-1 sm:py-2 shadow-sm">
            <span className="text-gray-600 font-medium text-xs sm:text-sm">
              Page
            </span>
            <input
              type="number"
              className="w-8 sm:w-12 text-center p-1 border border-gray-200 rounded focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none text-gray-700 font-medium text-xs sm:text-sm"
              value={pagination.page}
              min={1}
              max={pagination.totalPages}
              onChange={(e) => handlePageChange(Number(e.target.value))}
            />
            <span className="text-gray-600 font-medium text-xs sm:text-sm">
              of {pagination.totalPages}
            </span>
          </div>

          <button
            aria-label="Next Page"
            className="p-1.5 sm:p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
          >
            <FaAngleRight size={12} className="sm:w-4 sm:h-4 text-gray-600" />
          </button>
          <button
            aria-label="Last Page"
            className="p-1.5 sm:p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm"
            onClick={() => handlePageChange(pagination.totalPages)}
            disabled={pagination.page >= pagination.totalPages}
          >
            <FaAngleDoubleRight
              size={12}
              className="sm:w-4 sm:h-4 text-gray-600"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CdrTable;
