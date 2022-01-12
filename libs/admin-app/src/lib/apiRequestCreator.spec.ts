import apiRequestCreator, {
  loadingFailed,
  loadingStart,
  loadingSucceeded,
} from "./apiRequestCreator";
import { configureStore } from "@reduxjs/toolkit";

describe("The API request creater", () => {
  it("Starts by submitting a loadingStart action before the request is made", async () => {
    const reducer = jest.fn();

    const store = configureStore({ reducer });

    const request = apiRequestCreator<void>("foo", jest.fn());

    await store.dispatch(request());

    expect(reducer).toHaveBeenCalledWith(
      undefined,
      expect.objectContaining({
        type: loadingStart.type,
      })
    );
  });

  it("Submits a loading succeeded action when callback complete", async () => {
    const reducer = jest.fn();

    const store = configureStore({ reducer });

    const callback = jest.fn();

    callback.mockReturnValue("foobar");

    const request = apiRequestCreator<string>("foo", callback);

    await store.dispatch(request());

    expect(reducer).toHaveBeenCalledWith(
      undefined,
      expect.objectContaining({
        type: loadingSucceeded.type,
      })
    );
  });

  it("Submits a finishaction when callback is complete along with payload", async () => {
    const reducer = jest.fn();

    const store = configureStore({ reducer });

    const callback = jest.fn();

    callback.mockReturnValue("foobar");

    const request = apiRequestCreator<string>("foo", callback);

    await store.dispatch(request());

    expect(reducer).toHaveBeenCalledWith(
      undefined,
      expect.objectContaining({
        type: request.fulfilled.type,
        payload: "foobar",
      })
    );
  });

  it("Submits a loadingFailed action along with the error if there is an error", async () => {
    const reducer = jest.fn();

    const store = configureStore({ reducer });

    const callback = jest.fn();

    callback.mockRejectedValue(new Error("Oh noes!"));

    const request = apiRequestCreator<string>("foo", callback);

    await store.dispatch(request());

    expect(reducer).toHaveBeenCalledWith(
      undefined,
      expect.objectContaining({
        type: loadingFailed.type,
        payload: "Oh noes!",
      })
    );
  });
});
