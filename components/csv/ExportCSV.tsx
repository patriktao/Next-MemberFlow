import { Box } from "@chakra-ui/react";
import { DocumentData } from "firebase/firestore";
import { CSVLink } from "react-csv";

type Props = {
  data: DocumentData[];
  fileName: string;
};

const ExportCSV = ({ data, fileName }: Props) => {
  return (
    <Box w="full">
      <CSVLink
        data={data}
        separator={";"}
        target="_blank"
        filename={fileName + ".csv"}
      >
        Export to CSV
      </CSVLink>
    </Box>
  );
};

export default ExportCSV;
