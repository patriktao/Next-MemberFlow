import { Timestamp } from "firebase/firestore";

export interface State {
  email: string;
  name: string;
  ssn: string;
  gender: string;
  afMember: string;
  payMethod: string;
  period: string;
  hasPaid: string;
  regDate: Timestamp;
  errorMessage: string;
  isLoading: boolean;
}

export type Action =
  | { type: "email"; input: string }
  | { type: "name"; input: string }
  | { type: "ssn"; input: string }
  | { type: "gender"; input: string }
  | { type: "afMember"; input: string }
  | { type: "payMethod"; input: string }
  | { type: "period"; input: string }
  | { type: "hasPaid"; input: string }
  | { type: "regDate"; input: Timestamp }
  | { type: "errorMessage"; input: string }
  | { type: "isLoading"; input: boolean };

export const reducer = (state: State, action: Action): State => {
  try {
    switch (action.type) {
      case "email":
        return { ...state, email: action.input };
      case "name":
        return { ...state, name: action.input };
      case "gender":
        return { ...state, gender: action.input };
      case "ssn":
        return { ...state, ssn: action.input };
      case "afMember":
        return { ...state, afMember: action.input };
      case "payMethod":
        return { ...state, payMethod: action.input };
      case "period":
        return { ...state, period: action.input };
      case "hasPaid":
        return { ...state, hasPaid: action.input };
      case "regDate":
        return { ...state, regDate: action.input };
      case "errorMessage":
        return { ...state, errorMessage: action.input };
      case "isLoading":
        return { ...state, isLoading: action.input };
      default:
        return state;
    }
  } catch (error) {
    console.error(error);
  }
};
