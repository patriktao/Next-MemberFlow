import { Button, Spinner } from "@chakra-ui/react";
import React, { FunctionComponent, ReactNode } from "react";

interface Props {
  isLoading: boolean;
  size?: "sm" | "md" | "lg" | "xs";
  isDisabled?: boolean;
  color?: string;
  children?: ReactNode;
  onClick?: any | undefined;
  variant?: string;
}

const LoadingButton: React.FC<Props> = (props: Props) => {
  return (
    <Button
      type="submit"
      onClick={() => props.onClick || ""}
      colorScheme={props.color || "blue"}
      isDisabled={props.isDisabled || false}
      size={props.size ?? "md"}
      isLoading={props.isLoading}
      spinnerPlacement={"start"}
      variant={props.variant || "solid"}
      spinner={
        <Spinner
          style={{ marginLeft: "0.5rem" }}
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="md"
        />
      }
    >
      {props.children}
    </Button>
  );
};

export default LoadingButton;
