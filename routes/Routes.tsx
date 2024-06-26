import React from 'react';
import { useAtom } from 'jotai';
import Main from './navigation';
import Initial from '../scenes/initial/Initial';
import { checkedAtom, loggedInAtom } from '../utils/atom';

const Routes = () => {
  const [checked] = useAtom(checkedAtom);
  const [loggedIn] = useAtom(loggedInAtom);

  console.log('[##] loggedIn', loggedIn);

  if (!checked) {
    return <Initial />;
  }

  return <Main />;
};

export default Routes;
