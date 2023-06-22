import { m } from "framer-motion";
import { mapToOptions } from "../utils";

export const RequestTypes = {
  name: "name",
  email: "email",
  ssn: "ssn",
  period: "period",
  gender: "gender",
  afMember: "afMember",
  payMethod: "payMethod",
  regDate: "regDate",
  hasPaid: "hasPaid",
  requestId: "requestId",
};

export const MemberTypes = {
  name: "name",
  email: "email",
  period: "period",
  gender: "gender",
  reg_date: "reg_date",
  exp_date: "exp_date",
  ssn: "ssn",
  status: "status",
};

export const paymentMethods: string[] = ["swish", "cash", "stripe", "card"];

export const membershipPeriods: string[] = ["6", "12"];

export const yesNo: string[] = ["yes", "no"];

export const genders: string[] = ["male", "female", "other"];

export const periodOptions: { label: string; value: string }[] =
  mapToOptions(membershipPeriods);

export const paymentOptions: { label: string; value: string }[] =
  mapToOptions(paymentMethods);

export const yesNoOptions: { label: string; value: string }[] =
  mapToOptions(yesNo);

export const genderOptions: { label: string; value: string }[] =
  mapToOptions(genders);
