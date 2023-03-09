import { Spinner as ChakraSpinner } from "@chakra-ui/react";

interface Props {
  outerColor: string;
  innerColor: string;
  size?: "md" | "sm" | "lg" | "xl" | "xs";
}

const Spinner: React.FC<Props> = (props: Props) => {
  return (
    <ChakraSpinner
      style={{ marginLeft: "0.5rem" }}
      thickness="4px"
      speed="0.65s"
      emptyColor={props.outerColor ?? "gray.200"}
      color={props.innerColor ?? "gray.500"}
      size={props.size ?? "md"}
    />
  );
};

export default Spinner;
