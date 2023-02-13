import { useToast } from "@chakra-ui/react";

interface ToastProps {
  title: string;
  description?: string;
  status: "info" | "warning" | "success" | "error" | "loading";
  duration?: number;
  toast: Function;
}

const displayToast = (props: ToastProps) => {
  const toast = props.toast;
  toast({
    title: props.title,
    description: props.description,
    status: props.status,
    duration: props.duration | 3500,
    isClosable: true,
    position: 'top',
  });
};

export default displayToast;
