import { DocumentData } from "firebase/firestore";
import { CSVLink } from "react-csv";

type Props = {
  data: DocumentData[];
  fileName: string;
};

const ExportCSV = ({ data, fileName }: Props) => {
  return (
    <CSVLink
      data={data}
      separator={";"}
      target="_blank"
      filename={fileName + ".csv"}
    >
      Export to CSV
    </CSVLink>
  );
};

export default ExportCSV;
