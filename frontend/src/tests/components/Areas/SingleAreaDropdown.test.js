import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import { useState } from "react";

import SingleAreaDropdown from "main/components/Areas/SingleAreaDropdown";
import { oneArea } from "fixtures/areaFixtures";
import { threeAreas } from "fixtures/areaFixtures";
import { outOfOrderAreas } from "fixtures/areaFixtures";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn(),
  compareValues: jest.fn(),
}));

describe("SingleAreaDropdown tests", () => {
  beforeEach(() => {
    jest.spyOn(console, "error");
    console.error.mockImplementation(() => null);
  });

  beforeEach(() => {
    useState.mockImplementation(jest.requireActual("react").useState);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  const setArea = jest.fn();

  test("renders without crashing on one area", () => {
    render(
      <SingleAreaDropdown areas={oneArea} setArea={setArea} controlId="sad1" />,
    );
  });

  test("renders without crashing on three areas", async () => {
    render(
      <SingleAreaDropdown
        areas={[threeAreas[2], threeAreas[0], threeAreas[1]]}
        setArea={setArea}
        controlId="sad1"
      />,
    );

    const areaA = "sad1-option-A";
    const areaB = "sad1-option-B";
    const areaC = "sad1-option-C";

    // Check that blanks are replaced with hyphens
    await waitFor(() => expect(screen.getByTestId(areaA).toBeInTheDocument));
    await waitFor(() => expect(screen.getByTestId(areaB).toBeInTheDocument));
    await waitFor(() => expect(screen.getByTestId(areaC).toBeInTheDocument));

    // Check that the options are sorted
    // See: https://www.atkinsondev.com/post/react-testing-library-order/
    const allOptions = screen.getAllByTestId("sad1-option-", { exact: false });
    for (let i = 0; i < allOptions.length - 1; i++) {
      console.log("[i]" + allOptions[i].value);
      console.log("[i+1]" + allOptions[i + 1].value);
      expect(allOptions[i].value < allOptions[i + 1].value).toBe(true);
    }
  });

  test('renders "ALL" option when showAll is true', async () => {
    render(
      <SingleAreaDropdown
        areas={threeAreas}
        setArea={setArea}
        controlId="sad1"
        showAll={true}
      />,
    );

    const allOption = screen.queryByTestId("sad1-option-all");
    expect(allOption).toBeInTheDocument();
    expect(allOption).toHaveValue("ALL");
    expect(allOption).toHaveTextContent("ALL");

    // ensure other options are present
    const firstAreaAreaOption = await screen.findByTestId("sad1-option-A");
    expect(firstAreaAreaOption).toBeInTheDocument();
    expect(firstAreaAreaOption).toHaveTextContent(
      "A - English Reading and Composition",
    );

    const secondAreaAreaOption = await screen.findByTestId("sad1-option-B");
    expect(secondAreaAreaOption).toBeInTheDocument();
    expect(secondAreaAreaOption).toHaveTextContent("B - Foreign Language");

    const thirdAreaAreaOption = await screen.findByTestId("sad1-option-C");
    expect(thirdAreaAreaOption).toBeInTheDocument();
    expect(thirdAreaAreaOption).toHaveTextContent("C");
  });

  test('"ALL" option is not available when showAll is false', () => {
    render(
      <SingleAreaDropdown
        areas={threeAreas}
        setArea={setArea}
        controlId="sad1"
        showAll={false} // already false by default, so just visual
      />,
    );

    const allOption = screen.queryByTestId("sad1-option-all");
    expect(allOption).not.toBeInTheDocument();
  });

  test('"ALL" option is not available by default when showAll is not passed', () => {
    render(
      <SingleAreaDropdown
        areas={threeAreas}
        setArea={setArea}
        controlId="sad15"
        // showAll is not passed, should default to false
      />,
    );

    const allOption = screen.queryByTestId("sad15-option-all");
    expect(allOption).not.toBeInTheDocument();
  });

  test("sorts and puts hyphens in testids", () => {
    render(
      <SingleAreaDropdown
        areas={threeAreas}
        setArea={setArea}
        controlId="sad1"
      />,
    );
  });

  test("when I select an object, the value changes", async () => {
    render(
      <SingleAreaDropdown
        areas={threeAreas}
        setArea={setArea}
        controlId="sad1"
      />,
    );

    expect(
      await screen.findByLabelText("General Education Area"),
    ).toBeInTheDocument();

    const selectQuarter = screen.getByLabelText("General Education Area");
    userEvent.selectOptions(selectQuarter, "C");
    expect(setArea).toBeCalledWith("C");
  });

  test('when I select "ALL" option, value changes to "ALL"', async () => {
    render(
      <SingleAreaDropdown
        areas={threeAreas}
        setArea={setArea}
        controlId="sad1"
        showAll={true}
      />,
    );

    expect(
      await screen.findByLabelText("General Education Area"),
    ).toBeInTheDocument();

    const selectQuarter = screen.getByLabelText("General Education Area");
    userEvent.selectOptions(selectQuarter, "ALL");
    expect(setArea).toBeCalledWith("ALL");
  });

  test("out of order areas is sorted by area letter", async () => {
    render(
      <SingleAreaDropdown
        areas={outOfOrderAreas}
        setArea={setArea}
        controlId="sad1"
      />,
    );

    expect(
      await screen.findByText("General Education Area"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("A - English Reading and Composition"),
    ).toHaveAttribute("data-testid", "sad1-option-A");
  });

  test("if I pass a non-null onChange, it gets called when the value changes", async () => {
    const onChange = jest.fn();
    render(
      <SingleAreaDropdown
        areas={threeAreas}
        setArea={setArea}
        controlId="sad1"
        onChange={onChange}
      />,
    );

    expect(
      await screen.findByLabelText("General Education Area"),
    ).toBeInTheDocument();

    const selectArea = screen.getByLabelText("General Education Area");
    userEvent.selectOptions(selectArea, "C");
    await waitFor(() => expect(setArea).toBeCalledWith("C"));
    await waitFor(() => expect(onChange).toBeCalledTimes(1));

    // x.mock.calls[0][0] is the first argument of the first call to the jest.fn() mock x
    const event = onChange.mock.calls[0][0];
    expect(event.target.value).toBe("C");
  });

  test('onChange is called when value is "ALL"', async () => {
    const onChange = jest.fn();
    render(
      <SingleAreaDropdown
        areas={threeAreas}
        setArea={setArea}
        controlId="sad1"
        showAll={true}
        onChange={onChange}
      />,
    );

    expect(
      await screen.findByLabelText("General Education Area"),
    ).toBeInTheDocument();

    const selectArea = screen.getByLabelText("General Education Area");
    userEvent.selectOptions(selectArea, "ALL");
    await waitFor(() => expect(setArea).toBeCalledWith("ALL"));
    await waitFor(() => expect(onChange).toBeCalledTimes(1));

    const event = onChange.mock.calls[0][0];
    expect(event.target.value).toBe("ALL");
  });

  test("default label is General Education Area", async () => {
    render(
      <SingleAreaDropdown
        areas={threeAreas}
        setArea={setArea}
        controlId="sad1"
      />,
    );

    expect(
      await screen.findByLabelText("General Education Area"),
    ).toBeInTheDocument();
  });

  test("keys / testids are set correctly on options", async () => {
    render(
      <SingleAreaDropdown
        areas={threeAreas}
        setArea={setArea}
        controlId="sad1"
      />,
    );

    const expectedKey = "sad1-option-A";
    await waitFor(() =>
      expect(screen.getByTestId(expectedKey).toBeInTheDocument),
    );
  });

  test("when localstorage has a value, it is passed to useState", async () => {
    const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
    getItemSpy.mockImplementation(() => "C");

    const setAreaStateSpy = jest.fn();
    useState.mockImplementation((x) => [x, setAreaStateSpy]);

    render(
      <SingleAreaDropdown
        areas={threeAreas}
        setArea={setArea}
        controlId="sad1"
      />,
    );

    await waitFor(() => expect(useState).toBeCalledWith("C"));
  });

  test("when localstorage has no value, first element of area list is passed to useState", async () => {
    const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
    getItemSpy.mockImplementation(() => null);

    const setAreaStateSpy = jest.fn();
    useState.mockImplementation((x) => [x, setAreaStateSpy]);

    render(
      <SingleAreaDropdown
        areas={threeAreas}
        setArea={setArea}
        controlId="sad1"
      />,
    );

    await waitFor(() =>
      expect(useState).toBeCalledWith(expect.objectContaining({})),
    );
  });

  test("When no areas, dropdown is blank", async () => {
    render(
      <SingleAreaDropdown areas={[]} setArea={setArea} controlId="sad1" />,
    );

    const expectedKey = "sad1";
    expect(screen.queryByTestId(expectedKey)).toBeNull();
  });
});
