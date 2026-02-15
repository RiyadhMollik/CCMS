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
    <div className="p-4 md:p-6 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-green-800">
            Supervision Management
          </h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
          >
            {showForm ? "Hide Form" : "+ Add Student"}
          </button>
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
