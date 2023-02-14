import moment, { Moment } from "moment";

/* 
    @ Firebase returns timestamps as seconds
    This checks if the specific row data is a timestamp object
*/
export function getTimestamp(rowData: any) {
  return typeof rowData == "object" ? formatDate(rowData.toDate()) : rowData;
}

/* 
    @ Formats a Date object to string
*/
export function formatDate(date: Object) {
  return moment(date).format("YYYY/M/D");
}

export function calculateNextDate(m: Moment, period: number) {
  var fm = moment(m).add(period, "M");
  var fmEnd = moment(fm).endOf("month");
  return m.date() !== fm.date() && fm.isSame(fmEnd.format("YYYY-MM-DD"))
    ? fm.add(period, "d")
    : fm;
}
