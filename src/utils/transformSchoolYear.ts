import { SchoolYearConfirmationProps } from "@/components/SchoolYearConfirmation";
import { SchoolType } from '@/types/user';

export interface BackendSchoolYearPayload {
  schoolYear: {
    yearLabel: string;
    startDate: Date;
    endDate: Date;
    terms: {
      name: string;
      startDate: Date;
      endDate: Date;
    }[];
  };
  tuitionFees: {
    class: string;
    termName: string;
    amount: number;
    dueDate: Date;
  }[];
  extraFees: {
    name: string;
    school: SchoolType;
    description: string;
    amount: number;
    dueDate: Date;
    currency: "USD" | "CDF";
    frequency: "one-time" | "monthly" | "term" | "yearly";
  }[];
}

export const transformSchoolYearPayload = (
  data: SchoolYearConfirmationProps["schoolYearData"]
): BackendSchoolYearPayload => {
  const toDate = (value: string | Date) => new Date(value);
 const termDueDateMap: Record<string, Date> = {};
  data.terms.forEach((term) => {
    termDueDateMap[term.name] = new Date(term.endDate);
  });

  
  const tuitionFees: BackendSchoolYearPayload["tuitionFees"] = [];

  data.feeCategories.forEach((category, index) => {
    if (!Array.isArray(category.feesByClass)) {
    return; // ou throw une erreur personnalisée
  }
    category.feesByClass.forEach((feeClass) => {
      tuitionFees.push({
        class: feeClass.classId,
        termName: "1er trimestre",
        amount: feeClass.termFees.term1,
        dueDate: termDueDateMap["1er trimestre"],
      });
      tuitionFees.push({
        class: feeClass.classId,
        termName: "2e trimestre",
        amount: feeClass.termFees.term2,
        dueDate: termDueDateMap["2e trimestre"],
      });
      tuitionFees.push({
        class: feeClass.classId,
        termName: "3e trimestre",
        amount: feeClass.termFees.term3,
        dueDate: termDueDateMap["3e trimestre"],
      });
    });
  });

  const extraFees: BackendSchoolYearPayload["extraFees"] =
    data.additionalFees.map((fee) => ({
      name: fee.name,
      school: fee.school,
      description: fee.description,
      amount: fee.amount,
      currency: fee.currency,
      frequency: fee.frequency,
      dueDate: toDate(fee.paymentDeadline), // par défaut : à la fin de l’année scolaire
    }));

  return {
    schoolYear: {
      yearLabel: data.schoolYear,
      startDate: toDate(data.startDate),
      endDate: toDate(data.endDate),
      terms: data.terms.map((t) => ({
        name: t.name,
        startDate: toDate(t.startDate),
        endDate: toDate(t.endDate),
      })),
    },
    tuitionFees,
    extraFees,
  };
};
