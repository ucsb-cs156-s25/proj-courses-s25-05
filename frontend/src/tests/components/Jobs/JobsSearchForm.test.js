import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import JobsSearchForm from "main/components/Jobs/JobsSearchForm";

describe("JobsSearchForm", () => {
  const updateSortField = jest.fn();
  const updateSortDirection = jest.fn();
  const updatePageSize = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Storage.prototype, "setItem");
    jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => null);
  });

  test("renders all dropdowns with correct labels", () => {
    render(
      <JobsSearchForm
        updateSortField={updateSortField}
        updateSortDirection={updateSortDirection}
        updatePageSize={updatePageSize}
      />,
    );

    expect(screen.getByLabelText("Sort By")).toBeInTheDocument();
    expect(screen.getByLabelText("Sort Direction")).toBeInTheDocument();
    expect(screen.getByLabelText("Page Size")).toBeInTheDocument();
  });

  test("when I select a sortField, the state and localStorage update and callback is called", () => {
    render(
      <JobsSearchForm
        updateSortField={updateSortField}
        updateSortDirection={updateSortDirection}
        updatePageSize={updatePageSize}
      />,
    );
    const selectSortField = screen.getByLabelText("Sort By");
    userEvent.selectOptions(selectSortField, "createdAt");
    expect(selectSortField.value).toBe("createdAt");
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "JobsSearch.SortField",
      "createdAt",
    );
    expect(updateSortField).toHaveBeenCalledWith("createdAt");
  });

  test("when I select a sortDirection, the state and localStorage update and callback is called", () => {
    render(
      <JobsSearchForm
        updateSortField={updateSortField}
        updateSortDirection={updateSortDirection}
        updatePageSize={updatePageSize}
      />,
    );
    const selectSortDirection = screen.getByLabelText("Sort Direction");
    userEvent.selectOptions(selectSortDirection, "DESC");
    expect(selectSortDirection.value).toBe("DESC");
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "JobsSearch.SortDirection",
      "DESC",
    );
    expect(updateSortDirection).toHaveBeenCalledWith("DESC");
  });

  test("when I select a pageSize, the state and localStorage update and callback is called", () => {
    render(
      <JobsSearchForm
        updateSortField={updateSortField}
        updateSortDirection={updateSortDirection}
        updatePageSize={updatePageSize}
      />,
    );
    const selectPageSize = screen.getByLabelText("Page Size");
    userEvent.selectOptions(selectPageSize, "100");
    expect(selectPageSize.value).toBe("100");
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "JobsSearch.PageSize",
      "100",
    );
    expect(updatePageSize).toHaveBeenCalledWith("100");
  });

  test("renders correctly when fallback values are used", () => {
    render(
      <JobsSearchForm
        updateSortField={updateSortField}
        updateSortDirection={updateSortDirection}
        updatePageSize={updatePageSize}
      />,
    );

    // The default values should be selected
    expect(screen.getByLabelText("Sort By").value).toBe("status");
    expect(screen.getByLabelText("Sort Direction").value).toBe("ASC");
    expect(screen.getByLabelText("Page Size").value).toBe("5");
  });

  test("uses correct localStorage keys for all dropdowns", () => {
    render(
      <JobsSearchForm
        updateSortField={updateSortField}
        updateSortDirection={updateSortDirection}
        updatePageSize={updatePageSize}
      />,
    );

    userEvent.selectOptions(screen.getByLabelText("Sort By"), "updatedAt");
    userEvent.selectOptions(screen.getByLabelText("Sort Direction"), "DESC");
    userEvent.selectOptions(screen.getByLabelText("Page Size"), "20");

    expect(localStorage.setItem).toHaveBeenCalledWith(
      "JobsSearch.SortField",
      "updatedAt",
    );
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "JobsSearch.SortDirection",
      "DESC",
    );
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "JobsSearch.PageSize",
      "20",
    );
  });

  test("does not use default value if localStorage key is wrong", () => {
    jest.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
      if (key === "") return "WRONG";
      return null;
    });

    render(
      <JobsSearchForm
        updateSortField={updateSortField}
        updateSortDirection={updateSortDirection}
        updatePageSize={updatePageSize}
      />,
    );

    // The default values should still be selected, not "WRONG"
    expect(screen.getByLabelText("Sort By").value).toBe("status");
    expect(screen.getByLabelText("Sort Direction").value).toBe("ASC");
    expect(screen.getByLabelText("Page Size").value).toBe("5");
  });
});
