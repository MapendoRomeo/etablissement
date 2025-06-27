// src/api/schoolYearService.ts
import axios from "./axios";
import { SchoolYear } from "../types/schoolYear";

export const fetchSchoolYears = async (): Promise<SchoolYear[]> => {
  const res = await axios.get("/school-years");
  return res.data;
};

export const createSchoolYear = async (data: Partial<SchoolYear>) => {
  const res = await axios.post("/school-years", data);
  return res.data;
};

export const getCurrentSchoolYear = async (): Promise<SchoolYear> => {
  const res = await axios.get("/school-years/current");
  return res.data;
};