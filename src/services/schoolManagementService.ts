import instance from "@/api/axios";
import { Class, StudentData } from "@/types/user";

export const addClass = async (classData: {
  name: string;
  school: string; // schoolId (ObjectId)
  option?: string; // optionId (facultatif)
}) => {
  const res = await instance.post("/classes", classData);
  return res.data.data;
};

export const addStudent = async (studentData: {
  fullName: string;
  classId: string;
  schoolId: string;
  schoolYearId: string;
  paid: number;
}) => {
  const res = await instance.post("/students", studentData);
  return res.data.data;
};

export const deleteStudentById = async (studentId: string) => {
  const res = await instance.delete(`/students/${studentId}`);
  return res.data;
};

export const fetchTuitionTotal = async (className: string, schoolYearId: string) => {
  try {
    const response = await instance.get(`/tuitions/total/by-class-name`, {
    params: {
      className,
      schoolYearId
    }
  });
    return response.data.total;
  } catch (err) {
    return 0;
  }
};
