import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import SearchComponent from "./SearchComponent";
import MealPlanApi from "../api/api";
import UserContext from "../auth/UserContext";

jest.mock("../api/api");

const mockCurrentUser = { username: "testuser" };

const renderWithContext = (component) => {
  return render(
    <UserContext.Provider value={{ currentUser: mockCurrentUser }}>
      {component}
    </UserContext.Provider>
  );
};

describe("SearchComponent", () => {
  beforeEach(() => {
    MealPlanApi.searchRecipes.mockResolvedValue({ results: [] });
    MealPlanApi.getUserFavoritesSearch.mockResolvedValue([]);
  });

  it("renders correctly", async () => {
    renderWithContext(<SearchComponent />);
    expect(
      screen.getByPlaceholderText("Search For a Recipe...")
    ).toBeInTheDocument();
  });

  it("displays error message for empty search term", () => {
    renderWithContext(<SearchComponent />);
    fireEvent.submit(screen.getByRole("form"));
    expect(
      screen.getByText("Search term cannot be empty!")
    ).toBeInTheDocument();
  });

  it("displays loading spinner while fetching data", async () => {
    renderWithContext(<SearchComponent />);
    fireEvent.change(screen.getByPlaceholderText("Search For a Recipe..."), {
      target: { value: "test" },
    });
    fireEvent.submit(screen.getByRole("form"));
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("displays recipes after search", async () => {
    const recipes = [{ id: 1, title: "Recipe 1", image: "image.jpg" }];
    MealPlanApi.searchRecipes.mockResolvedValue({ results: recipes });
    renderWithContext(<SearchComponent />);
    fireEvent.change(screen.getByPlaceholderText("Search For a Recipe..."), {
      target: { value: "test" },
    });
    fireEvent.submit(screen.getByRole("form"));
    expect(await screen.findByText("Recipe 1")).toBeInTheDocument();
  });

  it("fetches user favorites on mount", async () => {
    const favorites = [{ recipeid: 1 }];
    MealPlanApi.getUserFavoritesSearch.mockResolvedValue(favorites);
    renderWithContext(<SearchComponent />);
    await waitFor(() =>
      expect(MealPlanApi.getUserFavoritesSearch).toHaveBeenCalled()
    );
    expect(
      screen.getByPlaceholderText("Search For a Recipe...")
    ).toBeInTheDocument();
  });

  it("handles view more click", async () => {
    const recipes = [{ id: 1, title: "Recipe 1", image: "image.jpg" }];
    MealPlanApi.searchRecipes.mockResolvedValue({ results: recipes });
    renderWithContext(<SearchComponent />);
    fireEvent.change(screen.getByPlaceholderText("Search For a Recipe..."), {
      target: { value: "test" },
    });
    fireEvent.submit(screen.getByRole("form"));
    fireEvent.click(await screen.findByText("View More"));
    expect(MealPlanApi.searchRecipes).toHaveBeenCalledTimes(2);
  });
});
