import { Box, forwardRef, Tag, Tooltip } from "@chakra-ui/react";

const CustomCard = forwardRef(({ children, ...rest }, ref) => (
  <Box p="1">
    <Tag ref={ref} {...rest}>
      {children}
    </Tag>
  </Box>
));

const ToolTip = ({ children }, text) => {
  return <Tooltip label={text}>{children}</Tooltip>;
};

export default ToolTip;
