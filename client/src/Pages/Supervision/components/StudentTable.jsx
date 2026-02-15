import React from "react";
import { EyeIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

const StudentTable = ({ students, loading, onView, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="bg-white shadow-xl rounded-2xl p-12 text-center border border-emerald-100">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          <p className="text-gray-600 font-medium">Loading students...</p>
        </div>
      </div>
    );
  }

  if (!students || students.length === 0) {
    return (
      <div className="bg-white shadow-xl rounded-2xl p-12 text-center border border-emerald-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div>
            <p className="text-gray-800 font-semibold text-lg">No students yet</p>
            <p className="text-gray-500 text-sm mt-1">Click "Add Student" to get started</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-emerald-100">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
              <th className="px-4 py-4 text-left text-sm font-semibold">#</th>
              <th className="px-4 py-4 text-left text-sm font-semibold">Name</th>
              <th className="px-4 py-4 text-left text-sm font-semibold hidden md:table-cell">Program</th>
              <th className="px-4 py-4 text-left text-sm font-semibold hidden lg:table-cell">University</th>
              <th className="px-4 py-4 text-left text-sm font-semibold hidden sm:table-cell">Email</th>
              <th className="px-4 py-4 text-center text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr
                key={student.id}
                className="border-b border-gray-100 hover:bg-emerald-50 transition-colors duration-150"
              >
                <td className="px-4 py-4 text-gray-600 text-sm font-medium">{index + 1}</td>
                <td className="px-4 py-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800 text-sm">
                      {student.studentName}
                    </span>
                    <span className="text-xs text-gray-500 sm:hidden mt-0.5">
                      {student.email}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 hidden md:table-cell">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    {student.programType}
                  </span>
                </td>
                <td className="px-4 py-4 text-gray-600 text-sm hidden lg:table-cell max-w-xs truncate">
                  {student.universityName}
                </td>
                <td className="px-4 py-4 text-gray-600 text-sm hidden sm:table-cell">{student.email}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => onView(student)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-150 cursor-pointer group"
                      title="View Details"
                    >
                      <EyeIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </button>
                    <button
                      onClick={() => onEdit(student)}
                      className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-150 cursor-pointer group"
                      title="Edit"
                    >
                      <PencilSquareIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </button>
                    <button
                      onClick={() => onDelete(student.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-150 cursor-pointer group"
                      title="Delete"
                    >
                      <TrashIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;
