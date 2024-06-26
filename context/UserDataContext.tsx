import React, {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useMemo,
} from 'react';
import { UserData } from '../types/user';

export interface UserDataContextType {
  userData: UserData;
  setUserData: Dispatch<SetStateAction<UserData>>;
}

export const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

interface UserDataContextProviderProps {
  children: ReactNode;
}

export const UserDataContextProvider: React.FC<UserDataContextProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<UserData>({
    id: '',
    email: '',
    fullName: '',
    avatar: '',
    Sell: [],
    Credit: [],
    quickadd: [],
    joined: new Date(),
    inventory: {
      seeds: {
        crops: [],
        variety: [],
        company: [],
      },
      fertilizers: {
        name: [],
        company: [],
      },
      pesticides: {
        name: [],
        company: [],
      },
    },
  });

  const contextValue = useMemo(() => ({ userData, setUserData }), [userData, setUserData]);

  return <UserDataContext.Provider value={contextValue}>{children}</UserDataContext.Provider>;
};
