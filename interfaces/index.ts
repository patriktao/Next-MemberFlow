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
