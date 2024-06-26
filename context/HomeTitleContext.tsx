/* eslint-disable import/prefer-default-export */
import { createContext, Dispatch, SetStateAction } from 'react';

interface HomeTitleContextType {
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
}

export const HomeTitleContext = createContext<HomeTitleContextType>({
  title: 'default title',
  setTitle: () => {},
});
