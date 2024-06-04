import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import FavoritesComponent from "./FavoritesComponent";
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

describe("FavoritesComponent", () => {
  it("renders correctly", async () => {
    MealPlanApi.getUserFavoritesSearch.mockResolvedValue([]);
    renderWithContext(<FavoritesComponent />);
    expect(
      screen.getByPlaceholderText("Search For a Recipe...")
    ).toBeInTheDocument();
  });

  it("displays error message for empty search term", () => {
    renderWithContext(<FavoritesComponent />);
    fireEvent.submit(screen.getByRole("form"));
    expect(
      screen.getByText("Search term cannot be empty!")
    ).toBeInTheDocument();
  });

  it("displays loading spinner while fetching data", async () => {
    MealPlanApi.searchRecipes.mockResolvedValue({ results: [] });
    renderWithContext(<FavoritesComponent />);
    fireEvent.change(screen.getByPlaceholderText("Search For a Recipe..."), {
      target: { value: "test" },
    });
    fireEvent.submit(screen.getByRole("form"));
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("displays recipes after search", async () => {
    const recipes = [{ id: 1, title: "Recipe 1", image: "image.jpg" }];
    MealPlanApi.searchRecipes.mockResolvedValue({ results: recipes });
    renderWithContext(<FavoritesComponent />);
    fireEvent.change(screen.getByPlaceholderText("Search For a Recipe..."), {
      target: { value: "test" },
    });
    fireEvent.submit(screen.getByRole("form"));
    expect(await screen.findByText("Recipe 1")).toBeInTheDocument();
  });
});
