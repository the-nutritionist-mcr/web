import { mock } from "jest-mock-extended";
import { GetServerSidePropsContext } from "next";
import { mocked } from "ts-jest/utils";
import { verifyJwtToken } from "@tnmw/verify-jwt";
import { authorizedRoute } from "./authorised-route";

jest.mock("@tnmw/verify-jwt");

describe("authorised route", () => {
  it("redirects to the login route without trying to verify if there is no token cookie", async () => {
    const mockContext = mock<GetServerSidePropsContext>();
    mockContext.req = mock<GetServerSidePropsContext["req"]>();
    mockContext.req.cookies = { foo: "bar" };

    const serversidePropsCallback = authorizedRoute();
    const response = await serversidePropsCallback(mockContext);

    expect(response).toEqual({
      redirect: { destination: "/login", permanent: false },
    });
    expect(mocked(verifyJwtToken)).not.toHaveBeenCalled();
  });

  it("redirects to the login route if the token cookie fails to verify", async () => {
    mocked(verifyJwtToken).mockResolvedValue({
      userName: "",
      isValid: false,
      groups: [],
    });
    const mockContext = mock<GetServerSidePropsContext>();
    mockContext.req = mock<GetServerSidePropsContext["req"]>();
    mockContext.req.cookies = { "foo.accessToken": "invalidtoken" };

    const serversidePropsCallback = authorizedRoute();
    const response = await serversidePropsCallback(mockContext);

    expect(response).toEqual({
      redirect: { destination: "/login", permanent: false },
    });
  });

  it("redirects to the login route if verify is successful but there are groups passed in that are not returned in the claim", async () => {
    mocked(verifyJwtToken).mockResolvedValue({
      userName: "user",
      isValid: true,
      groups: ["a-different-group"],
    });
    const mockContext = mock<GetServerSidePropsContext>();
    mockContext.req = mock<GetServerSidePropsContext["req"]>();
    mockContext.req.cookies = { "foo.accessToken": "invalidtoken" };

    const serversidePropsCallback = authorizedRoute({ groups: ["a-group"] });
    const response = await serversidePropsCallback(mockContext);

    expect(response).toEqual({
      redirect: { destination: "/login", permanent: false },
    });
  });

  it("does not redirect to login if verify is successful and a group is returned by the claim that was passed in", async () => {
    mocked(verifyJwtToken).mockResolvedValue({
      userName: "user",
      isValid: true,
      groups: ["a-different-group", "a-group"],
    });
    const mockContext = mock<GetServerSidePropsContext>();
    mockContext.req = mock<GetServerSidePropsContext["req"]>();
    mockContext.req.cookies = { "foo.accessToken": "invalidtoken" };

    const serversidePropsCallback = authorizedRoute({ groups: ["a-group"] });
    const response = await serversidePropsCallback(mockContext);

    expect(response).toEqual({ props: {} });
  });

  it("does not redirect to login if no groups were passed in regardless of what groups were returned by the claim", async () => {
    mocked(verifyJwtToken).mockResolvedValue({
      userName: "user",
      isValid: true,
      groups: ["a-different-group", "a-group"],
    });
    const mockContext = mock<GetServerSidePropsContext>();
    mockContext.req = mock<GetServerSidePropsContext["req"]>();
    mockContext.req.cookies = { "foo.accessToken": "invalidtoken" };

    const serversidePropsCallback = authorizedRoute();
    const response = await serversidePropsCallback(mockContext);

    expect(response).toEqual({ props: {} });
  });

  it("calls the supplied serversideprops callback and returns the result if verify is successful", async () => {
    mocked(verifyJwtToken).mockResolvedValue({
      userName: "user",
      isValid: true,
      groups: ["a-different-group", "a-group"],
    });

    const mockContext = mock<GetServerSidePropsContext>();
    mockContext.req = mock<GetServerSidePropsContext["req"]>();
    mockContext.req.cookies = { "foo.accessToken": "a.valid.token" };

    const mockProps = { props: {} };
    const getServerSideProps = jest.fn(() => Promise.resolve(mockProps));

    const serversidePropsCallback = authorizedRoute({ getServerSideProps });
    const response = await serversidePropsCallback(mockContext);

    expect(getServerSideProps).toHaveBeenCalled();
    expect(response).toEqual(mockProps);
  });
});
