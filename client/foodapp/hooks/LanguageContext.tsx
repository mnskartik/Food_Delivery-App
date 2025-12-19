import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axiosConfig";

type Language = "en" | "zu";

const LanguageContext = createContext<any>(null);

export const useLanguage = () => useContext(LanguageContext);

export function LanguageProvider({ children }: { children: any }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    api
      .get("/users/me")
      .then((res) => {
        if (res.data.language) {
          setLanguage(res.data.language);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
