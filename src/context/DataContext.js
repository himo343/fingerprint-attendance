import React, { createContext, useState, useContext } from "react";

// إنشاء الـ Context
const DataContext = createContext();

// دالة لاستخدام الـ Context في المكونات الأخرى
export const useData = () => useContext(DataContext);

// مكون يوفر الـ Context للمكونات الأخرى
export const DataProvider = ({ children }) => {
  const [data, setData] = useState({
    attendance: 135,
    absences: 15,
    employees: 150,
  });

  // دالة لتحديث البيانات
  const updateData = () => {
    // هنا يمكن إضافة منطق لجلب البيانات من API أو مصدر آخر
    setData({
      attendance: 140, // قيمة محدثة كمثال
      absences: 10,
      employees: 155,
    });
  };

  return (
    <DataContext.Provider value={{ data, updateData }}>
      {children}
    </DataContext.Provider>
  );
};
