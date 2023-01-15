import { createContext, useContext, useState, useEffect, useCallback } from "react";

interface IRiddle {
  title: string;
  question: string;
  answer: string;
}

interface IJoke {
  joke: string;
}

interface IDataContext {
  riddles: IRiddle[];
  jokes: IJoke[];
  fetchRiddles: () => Promise<void>;
  fetchJokes: () => Promise<void>;
}

export const DataContext = createContext<IDataContext>({
  riddles: [],
  jokes: [],
  fetchRiddles: () => Promise.resolve(),
  fetchJokes: () => Promise.resolve(),
});

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [riddles, setRiddles] = useState<IRiddle[]>([]);
  const [jokes, setJokes] = useState<IJoke[]>([]);

  const fetchRiddles = useCallback(async () => {
    try {
      const response = await fetch("https://api.api-ninjas.com/v1/riddles");
      const riddles = await response.json();
      setRiddles(riddles);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const fetchJokes = useCallback(async () => {
    const limit = 10;
    try {
      const response = await fetch(
        "https://api.api-ninjas.com/v1/jokes?limit='" + limit,
        {
          headers: {
            "X-Api-Key": "0DhBnOBWv10+HOeWsN0T1w==KEfK5ymNm4BcPBud",
          },
        }
      );
      const jokes = await response.json();
      setJokes(jokes);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchRiddles();
    fetchJokes();
  }, []);

  return (
    <DataContext.Provider value={{ riddles, jokes, fetchRiddles, fetchJokes }}>
      {children}
    </DataContext.Provider>
  );
};

