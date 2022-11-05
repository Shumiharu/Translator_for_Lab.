import React, { useEffect, useState } from "react";
import { Member } from '../interfaces/member';
import { autholize, logIn, logOut } from '../axios'

interface Props {
  children: React.ReactNode;
}
export interface MemberContextInterface {
  member: Member | null;
  setMember: React.Dispatch<React.SetStateAction<Member | null>>
}

export const MemberContext = React.createContext<MemberContextInterface | null>({} as MemberContextInterface);

export const MemberProvider = (props: Props) => {
  const { children } = props;
  const [member, setMember] = useState<Member | null>(null);
  
  const value: MemberContextInterface = { member, setMember }; 

  return(
    <MemberContext.Provider value={value}>
      {children}
    </MemberContext.Provider>
  )
}
