import { Hub } from "@aws-amplify/core";
import { Auth } from "@aws-amplify/auth";
import { act, renderHook } from "@testing-library/react-hooks";
import { HubPayload } from "@aws-amplify/core/lib-esm/Hub";
import { errorSelector } from "../../../lib/rootReducer";
import { mock } from "jest-mock-extended";
import { mocked } from "ts-jest/utils";
import { useApp } from ".";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { when } from "jest-when";

// eslint-disable-next-line no-console
console.warn = (): void => {
  // NOOP
};

jest.mock("react-router-dom", () => ({ useLocation: jest.fn() }));
jest.mock("react-redux");

describe("userApp", () => {
  afterEach(() => jest.clearAllMocks());

  describe("user", () => {
    it("defaults to undefined", async () => {
      const location = mock<ReturnType<typeof useLocation>>();
      // eslint-disable-next-line unicorn/no-useless-undefined
      jest.spyOn(Auth, "currentAuthenticatedUser").mockResolvedValue(undefined);
      location.pathname = "foo";
      mocked(useLocation, true).mockReturnValue(location);
      const { result, unmount } = renderHook(() => useApp());
      expect(result.current.user).toBeUndefined();
      unmount();
    });

    it("gets the latest user when the hub emits an auth event", async () => {
      const location = mock<ReturnType<typeof useLocation>>();
      location.pathname = "foo";
      mocked(useLocation, true).mockReturnValue(location);
      mocked(Auth, true).currentAuthenticatedUser.mockResolvedValue({
        signInUserSession: {
          accessToken: {
            payload: {
              "cognito:groups": ["foo", "bar"],
              "cognito:username": "foo-username",
              "cognito:email": "foo-email",
            },
          },
        },
      });

      const { waitFor, waitForNextUpdate, result } = renderHook(() => useApp());

      await act(async () => {
        await waitForNextUpdate();
      });

      mocked(Auth, true).currentAuthenticatedUser.mockResolvedValue({
        signInUserSession: {
          accessToken: {
            payload: {
              "cognito:groups": ["baz"],
              "cognito:username": "baz-username",
              "cognito:email": "baz-email",
            },
          },
        },
      });

      act(() => {
        Hub.dispatch("auth", {} as HubPayload);
      });

      await waitFor(() =>
        expect(result.current.user).toEqual({
          groups: ["baz"],
          username: "baz-username",
          email: "baz-email",
        })
      );
    });

    it("returns the current user when returned by amplify", async () => {
      const location = mock<ReturnType<typeof useLocation>>();
      location.pathname = "foo";
      mocked(useLocation, true).mockReturnValue(location);
      jest.spyOn(Auth, "currentAuthenticatedUser").mockResolvedValue({
        signInUserSession: {
          accessToken: {
            payload: {
              "cognito:groups": ["foo", "bar"],
              "cognito:username": "foo-username",
              "cognito:email": "foo-email",
            },
          },
        },
      });
      const { result, waitForNextUpdate } = renderHook(() => useApp());

      await act(async () => {
        await waitForNextUpdate();
      });

      expect(result.current.user).toEqual({
        groups: ["foo", "bar"],
        username: "foo-username",
        email: "foo-email",
      });
    });
  });

  describe("error", () => {
    it("returns whatever the useSelector hook returns", () => {
      const location = mock<ReturnType<typeof useLocation>>();
      // eslint-disable-next-line unicorn/no-useless-undefined
      when(mocked(useSelector, true))
        .calledWith(
          // eslint-disable-next-line no-bitwise
          errorSelector as (errorState: unknown) => string | undefined
        )
        .mockReturnValue("foobar");
      // eslint-disable-next-line unicorn/no-useless-undefined
      jest.spyOn(Auth, "currentAuthenticatedUser").mockResolvedValue(undefined);
      location.pathname = "foo";
      mocked(useLocation, true).mockReturnValue(location);
      const { result, unmount } = renderHook(() => useApp());
      expect(result.current.error).toBe("foobar");
      unmount();
    });
  });
});
