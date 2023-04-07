// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import { User } from 'path/to/interfaces';

import { Timestamp } from "firebase/firestore";

export interface RequestForm {
  requestId?: string;
  email: string;
  name: string;
  ssn: string;
  period: string;
  gender: string;
  afMember: string;
  payMethod: string;
  regDate: Timestamp;
  hasPaid: string;
}
