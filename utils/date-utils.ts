import { Timestamp } from "firebase/firestore";
import moment, { Moment } from "moment";

/* 
    @ Firebase returns timestamps as seconds
    This checks if the specific row data is a timestamp object
*/
export function getTimestamp(rowData: any): string {
  return typeof rowData == "object" ? formatDate(rowData.toDate()) : rowData;
}

/* 
    @ Formats a Date object to string, returns the date in string
*/
export function formatDate(date: Date): string {
  return moment(date).format("YYYY/M/D");
}

export function calculateNextDate(m: Moment, period: number): Moment {
  let fm = moment(m).add(period, "M");
  let fmEnd = moment(fm).endOf("month");
  return m.date() !== fm.date() && fm.isSame(fmEnd.format("YYYY-MM-DD"))
    ? fm.add(period, "d")
    : fm;
}

/* 
  @ Converts a date object to a Timestamp object to store in Firebase
*/

export function toTimestamp(date: Date) {
  try {
    return Timestamp.fromDate(date);
  } catch (err) {
    console.log("Problem converting date to timestamp" + err);
  }
}
