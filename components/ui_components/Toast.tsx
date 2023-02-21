import { useToast } from "@chakra-ui/react";

interface ToastProps {
  title: string;
  description?: string;
  status: "info" | "warning" | "success" | "error" | "loading";
  duration?: number;
  toast: Function;
  position?: string;
}

const displayToast = (props: ToastProps) => {
  const toast = props.toast;
  toast({
    title: props.title,
    description: props.description,
    status: props.status,
    duration: props.duration | 4000,
    isClosable: true,
    position: props.position ?? "bottom",
  });
};

export default displayToast;
