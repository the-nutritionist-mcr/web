import { Box, Header, Heading, Text } from "grommet";
import { Logout } from "grommet-icons";
import { Auth } from "@aws-amplify/auth";
import { MenuButton } from "..";
import React from "react";
import styled from "styled-components";
import { navbarRoutes } from "../router/navbar-routes";

const NonPrintableHeader = styled(Header)`
  @media print {
    display: none;
  }
`;

const BoxWithGap = styled(Box)`
  gap: 40px;
`;

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const groups = (anonymous: boolean | undefined) =>
  anonymous ? ["anonymous", "user", "admin"] : ["user", "admin"];

const NavBar: React.FC = () => {
  const env = process.env.REACT_APP_ENVIRONMENT;
  const buttons = [
    ...Object.entries(navbarRoutes).map(([path, route]) => (
      <MenuButton
        key={path}
        to={path}
        groups={groups(route.anonymous)}
        icon={route.icon}
      >
        {route.name ?? capitalizeFirstLetter(path.split("/")[1])}
      </MenuButton>
    )),
    <MenuButton
      key="logout"
      groups={["anonymous", "user", "admin"]}
      onClick={async (): Promise<void> => {
        await Auth.signOut();
        location.replace("/");
      }}
      icon={<Logout />}
    >
      Logout
    </MenuButton>,
  ];

  return (
    <NonPrintableHeader
      align="center"
      justify="start"
      background="brand"
      pad={{ horizontal: "small", vertical: "small" }}
    >
      <Heading level={1} size="small">
        TNM Admin
      </Heading>
      <BoxWithGap
        flex="grow"
        justify="stretch"
        direction="row"
        alignContent="stretch"
      >
        {buttons}
      </BoxWithGap>
      <Box direction="row" gap="medium" alignContent="start">
        <Text size="small" alignSelf="center">
          Version {process.env.REACT_APP_VERSION_NUMBER}
          {env ? ` (${env})` : null}
        </Text>
      </Box>
    </NonPrintableHeader>
  );
};

export default NavBar;
