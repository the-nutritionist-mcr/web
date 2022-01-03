import { FC } from "react";
import { Hero, Layout, Button } from "@tnmw/components";
import Router from "next/router";
import { signOut } from "../aws/authenticate";

import AccountIcon from "../images/TNM_Icons_Final_Account.png";
import styled from "@emotion/styled";
import { authorizedRoute } from "../utils/authorised-route";

const YourAccountHeaderBox = styled("div")`
  text-align: center;
  color: #3b7d7a;
  align-items: center;
  flex-direction: row;
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const YourAccountHeader = styled("h1")`
  font-size: 40px;
  display: auto;
  margin: 0.5rem 0 0 0;
`;

const Account: FC = () => {
  return (
    <Layout>
      <Hero>
        <YourAccountHeaderBox>
          <img
            src={AccountIcon as unknown as string}
            alt=""
            height="80"
            width="80"
          />
          <YourAccountHeader>Your Account</YourAccountHeader>
        </YourAccountHeaderBox>
      </Hero>
      <h2>You are logged in</h2>
      <Button
        onClick={async () => {
          await signOut();
          await Router.push("/");
        }}
      >
        Logout
      </Button>
    </Layout>
  );
};

export const getServerSideProps = authorizedRoute();

export default Account;
