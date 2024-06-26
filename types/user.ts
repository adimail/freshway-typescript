export interface UserData {
  token?: boolean;
  id: string;
  email: string;
  fullName: string;
  avatar: string;
  Sell: string[];
  Credit: string[];
  quickadd: {
    title: string;
    category: string;
    amounts: string[];
  }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  joined: Date | any;
  inventory: {
    seeds: {
      crops: string[];
      variety: string[];
      company: string[];
    };
    fertilizers: {
      name: string[];
      company: string[];
    };
    pesticides: {
      name: string[];
      company: string[];
    };
  };
}
