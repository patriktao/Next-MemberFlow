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

export interface MemberForm {
  memberId?: string;
  name: string;
  email: string;
  period: string;
  gender: string;
  reg_date?: Timestamp;
  exp_date?: Timestamp;
  ssn: string;
  status: string;
}