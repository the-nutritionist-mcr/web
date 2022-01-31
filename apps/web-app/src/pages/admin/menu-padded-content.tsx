import styled from '@emotion/styled';

export const MenuPaddedContent = styled('div')(({ theme }) => {
  return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    paddingTop: `calc(${theme.menubarHeight}px + 14px)`,
  };
});
