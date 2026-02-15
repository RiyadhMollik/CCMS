import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import API_BASE_URL from "../../config/api";
import AddStudentForm from "./components/AddStudentForm";
import StudentTable from "./components/StudentTable";
import StudentViewModal from "./components/StudentViewModal";
import StudentEditModal from "./components/StudentEditModal";

const Supervision = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewStudent, setViewStudent] = useState(null);
  const [editStudent, setEditStudent] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/students`);
      const json = await res.json();
      if (json.success) {
        setStudents(json.data);
      } else {
        toast.error("Failed to load students");
      }
    } catch (err) {
      toast.error("Error fetching students");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/students/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        toast.success("Student deleted successfully");
        fetchStudents();
      } else {
        toast.error(json.message || "Delete failed");
      }
    } catch (err) {
      toast.error("Error deleting student");
      console.error(err);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchStudents();
  };

  const handleEditSuccess = () => {
    setEditStudent(null);
    fetchStudents();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
                Student Supervision
              </h1>
              <p className="text-gray-600 mt-2 text-sm md:text-base">
                Manage and track research students
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-emerald-200 hover:shadow-xl transition-all duration-200 cursor-pointer"
            >
              {showForm ? (
                <>
                  <span>✕</span>
                  <span className="hidden sm:inline">Close Form</span>
                </>
              ) : (
                <>
                  <span className="text-xl">+</span>
                  <span>Add Student</span>
                </>
              )}
            </button>
          </div>
        </div>

        {showForm && (
          <AddStudentForm onSuccess={handleFormSuccess} />
        )}

        <StudentTable
          students={students}
          loading={loading}
          onView={(student) => setViewStudent(student)}
          onEdit={(student) => setEditStudent(student)}
          onDelete={handleDelete}
        />

        {viewStudent && (
          <StudentViewModal
            student={viewStudent}
            onClose={() => setViewStudent(null)}
          />
        )}

        {editStudent && (
          <StudentEditModal
            student={editStudent}
            onClose={() => setEditStudent(null)}
            onSuccess={handleEditSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default Supervision;
