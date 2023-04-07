import { Tooltip } from "@chakra-ui/react";
import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
  label?: string;
}

const ToolTip: React.FC<Props> = (props: Props) => {
  return <Tooltip label={props.label}>{props.children}</Tooltip>;
};

export default ToolTip;
