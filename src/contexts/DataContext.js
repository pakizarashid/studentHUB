import React, { createContext, useState, useEffect, useContext } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // console.log('DataProvider is running');
  }, []);

  const storeUserData = (data) => {
    setUserData(data);
    // console.log('UserData stored:', data);
  };

  useEffect(() => {
  }, [userData, storeUserData]);
  
  return (
    <DataContext.Provider value={{ userData, storeUserData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);

