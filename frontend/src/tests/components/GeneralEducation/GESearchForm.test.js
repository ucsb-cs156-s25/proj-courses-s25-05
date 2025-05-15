import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "react-toastify";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { allTheAreas } from "fixtures/areaFixtures";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
// import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import GESearchForm from "main/components/GeneralEducation/GESearchForm";

jest.mock("react-toastify", () => ({
  toast: jest.fn(),
}));

describe("GESearchForm tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  const queryClient = new QueryClient();
  const addToast = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error");
    console.error.mockImplementation(() => null);

    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);

    toast.mockReturnValue({
      addToast: addToast,
    });
  });

  test("renders without crashing", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GESearchForm />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });

  test("when I select an area, the state for area changes", () => {
    axiosMock.onGet("/api/UCSBAreas/all").reply(200, allTheAreas); // ADJUST FINAL API NAME

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GESearchForm />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    const selectArea = screen.getByLabelText("General Education Area");
    userEvent.selectOptions(selectArea, "C");
    expect(selectArea.value).toBe("C");
  });

  test("when I click submit, the right stuff happens", async () => {
    axiosMock.onGet("/api/UCSBAreas/all").reply(200, allTheAreas); // ADJUST FINAL API NAME
    const sampleReturnValue = {
      sampleKey: "sampleValue",
    };

    const fetchJSONSpy = jest.fn();

    fetchJSONSpy.mockResolvedValue(sampleReturnValue);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GESearchForm fetchJSON={fetchJSONSpy} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedFields = {
      area: "B",
    };

    const expectedKey = "GeneralEducationSearch.Area-option-B";
    await waitFor(() =>
      expect(screen.getByTestId(expectedKey).toBeInTheDocument),
    );

    const selectArea = screen.getByLabelText("General Education Area");
    userEvent.selectOptions(selectArea, "B");
    const submitButton = screen.getByText("Submit");
    userEvent.click(submitButton);

    await waitFor(() => expect(fetchJSONSpy).toHaveBeenCalledTimes(1));

    expect(fetchJSONSpy).toHaveBeenCalledWith(
      expect.any(Object),
      expectedFields,
    );
  });

  test("when I click submit when JSON is EMPTY, setCourse is not called!", async () => {
    axiosMock.onGet("/api/UCSBAreas/all").reply(200, allTheAreas); // ADJUST FINAL API NAME

    const sampleReturnValue = {
      sampleKey: "sampleValue",
      total: 0,
    };

    const fetchJSONSpy = jest.fn();

    fetchJSONSpy.mockResolvedValue(sampleReturnValue);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <GESearchForm fetchJSON={fetchJSONSpy} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedKey = "GeneralEducationSearch.Area-option-D";
    await waitFor(() =>
      expect(screen.getByTestId(expectedKey).toBeInTheDocument),
    );

    const selectArea = screen.getByLabelText("General Education Area");
    userEvent.selectOptions(selectArea, "D");
    const submitButton = screen.getByText("Submit");
    userEvent.click(submitButton);
  });

  //   test("renders without crashing when fallback values are used", async () => {
  //     axiosMock.onGet("/api/systemInfo").reply(200, {
  //       springH2ConsoleEnabled: false,
  //       showSwaggerUILink: false,
  //       startQtrYYYYQ: null, // use fallback value
  //       endQtrYYYYQ: null, // use fallback value
  //     });

  //     render(
  //       <QueryClientProvider client={queryClient}>
  //         <MemoryRouter>
  //           <GESearchForm />
  //         </MemoryRouter>
  //       </QueryClientProvider>,
  //     );

  //     // Make sure the first and last options
  //     expect(
  //       await screen.findByTestId(/BasicSearch.Quarter-option-0/),
  //     ).toHaveValue("20211");
  //     expect(
  //       await screen.findByTestId(/BasicSearch.Quarter-option-3/),
  //     ).toHaveValue("20214");
  //   });
});
