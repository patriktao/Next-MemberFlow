import moment from "moment";

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
