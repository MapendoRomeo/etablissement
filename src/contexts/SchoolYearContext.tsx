import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "../api/axios";

interface Trimester {
  name: string;
  startDate: string;
  endDate: string;
}

interface SchoolYear {
  _id: string;
  startDate: string;
  endDate: string;
  trimesters: Trimester[];
  isActive: boolean;
}

interface SchoolYearContextType {
  activeYear: SchoolYear | null;
  loadActiveYear: () => Promise<void>;
}

export const SchoolYearContext = createContext<SchoolYearContextType | undefined>(undefined);

export const SchoolYearProvider = ({ children }: { children: ReactNode }) => {
  const [activeYear, setActiveYear] = useState<SchoolYear | null>(null);

  useEffect(() => {
    loadActiveYear();
  }, []);

  const loadActiveYear = async () => {
    try {
      const res = await axios.get("/school-year/active");
      setActiveYear(res.data);
    } catch (err) {
    }
  };

  return (
    <SchoolYearContext.Provider value={{ activeYear, loadActiveYear }}>
      {children}
    </SchoolYearContext.Provider>
  );
};

export const useSchoolYear = () => {
  const context = useContext(SchoolYearContext);
  if (!context) throw new Error("useSchoolYear must be used within SchoolYearProvider");
  return context;
};
