import { useState } from "react";
import { initialApps } from "../utils/demoData.js";

export function usePortalData() {
  const [apps, setApps] = useState(initialApps);
  const [consultations, setConsultations] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("claro-consultations") || "[]");
    } catch {
      return [];
    }
  });
  const addConsultation = (consultation) => {
    setConsultations((current) => {
      const next = [consultation, ...current];
      localStorage.setItem("claro-consultations", JSON.stringify(next));
      return next;
    });
  };
  return { apps, setApps, consultations, addConsultation };
}
