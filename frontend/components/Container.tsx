import { Flex } from '@chakra-ui/core';

type Props = {
  withOverlay?: boolean;
  children?: React.ReactNode;
};

const overlayProps = {
  bgImage: `url('/shiny_overlay.svg')`,
  bgSize: 'cover',
  bgPos: 'center',
  bgRepeat: 'no-repeat',
  bgAttachment: 'fixed'
};

export const Container: React.FC<Props> = ({
  withOverlay,
  children,
  ...props
}: Props) => {
  return (
    <Flex
      minH="100vh"
      direction="column"
      {...props}
      {...(withOverlay ? overlayProps : null)}
    >
      {children}
    </Flex>
  );
};
