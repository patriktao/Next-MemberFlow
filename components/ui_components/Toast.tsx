import { ToastPosition, useToast } from "@chakra-ui/react";

interface ToastProps {
  title: string;
  description?: string;
  status: "info" | "warning" | "success" | "error" | "loading";
  duration?: number;
}

function displayToast({ title, description, status, duration }: ToastProps) {
  const toast = useToast();
  try {
    () =>
      toast({
        title: title,
        description: description,
        status: status,
        duration: duration || 8000,
        isClosable: true,
        position: "top",
      });
  } catch (error) {
    console.error(error);
    return new Error("Toast error");
  }
}

export default displayToast;
