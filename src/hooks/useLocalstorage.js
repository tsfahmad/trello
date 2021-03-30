import { useEffect, useState } from "react";

const useLocalStorage = (key, initialData) => {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    try {
      const dataFromStorage = JSON.parse(localStorage.getItem(key));
      setData(dataFromStorage || initialData);
    }
    catch(err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(data));
  }, [key, data]);

  const setDataInLocalStorage = (newData) => {
    setData(newData);
  }

  return [data, setDataInLocalStorage]
}

export default useLocalStorage;