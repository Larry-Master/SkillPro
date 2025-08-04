import { useState } from 'react';
import { enrollApi } from '@/lib/api';

export function useEnroll() {
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [enrollLoading, setEnrollLoading] = useState(false);

  const handleEnroll = async () => {
    if (!selectedStudent || !selectedCourse) {
      alert("Please select both student and course");
      return false;
    }

    setEnrollLoading(true);
    try {
      await enrollApi.enroll(selectedStudent, selectedCourse);
      setSelectedStudent("");
      setSelectedCourse("");
      alert("Enrollment successful!");
      return true;
    } catch (err) {
      console.error("Enrollment error:", err);
      alert("Enrollment failed!");
      return false;
    } finally {
      setEnrollLoading(false);
    }
  };

  return {
    selectedStudent,
    setSelectedStudent,
    selectedCourse,
    setSelectedCourse,
    enrollLoading,
    handleEnroll
  };
}
