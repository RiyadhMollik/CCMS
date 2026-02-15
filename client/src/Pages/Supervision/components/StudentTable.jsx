import React from "react";
import { EyeIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

const StudentTable = ({ students, loading, onView, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="bg-white shadow rounded-xl p-8 text-center text-gray-500">
        Loading students...
      </div>
    );
  }

  if (!students || students.length === 0) {
    return (
      <div className="bg-white shadow rounded-xl p-8 text-center text-gray-500">
        No students found. Click "+ Add Student" to add one.
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-green-100">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-green-700 text-white">
              <th className="px-4 py-3 text-left font-semibold">#</th>
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Program</th>
              <th className="px-4 py-3 text-left font-semibold">University</th>
              <th className="px-4 py-3 text-left font-semibold">Email</th>
              <th className="px-4 py-3 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr
                key={student.id}
                className="border-b border-gray-100 hover:bg-green-50 transition-colors"
              >
                <td className="px-4 py-3 text-gray-600">{index + 1}</td>
                <td className="px-4 py-3 font-medium text-gray-800">
                  {student.studentName}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                    {student.programType}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {student.universityName}
                </td>
                <td className="px-4 py-3 text-gray-600">{student.email}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onView(student)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      title="View Details"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onEdit(student)}
                      className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <PencilSquareIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onDelete(student.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <TrashIcon className="w-5 h-5" />
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
