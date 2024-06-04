import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import RecipeCard from "./RecipeCard";
import MealPlanApi from "../api/api";

jest.mock("../api/api");

describe("RecipeCard Component", () => {
  const recipe = {
    id: 1,
    title: "Delicious Recipe",
    image: "recipe.jpg",
  };

  it("renders correctly", () => {
    const { asFragment } = render(
      <RecipeCard
        recipe={recipe}
        isFavorite={false}
        onAddFavorite={jest.fn()}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("opens recipe model on image click", () => {
    render(
      <RecipeCard
        recipe={recipe}
        isFavorite={false}
        onAddFavorite={jest.fn()}
      />
    );
    fireEvent.click(screen.getByAltText("Delicious Recipe"));
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("handles favorite change", () => {
    const handleAddFavorite = jest.fn();
    render(
      <RecipeCard
        recipe={recipe}
        isFavorite={false}
        onAddFavorite={handleAddFavorite}
      />
    );
    fireEvent.click(screen.getByRole("button"));
    expect(handleAddFavorite).toHaveBeenCalledWith(1, true);
  });

  it("opens recipe card in a new tab", async () => {
    MealPlanApi.getRecipeCard.mockResolvedValue({ url: "http://example.com" });
    window.open = jest.fn();
    render(
      <RecipeCard
        recipe={recipe}
        isFavorite={false}
        onAddFavorite={jest.fn()}
      />
    );
    fireEvent.click(screen.getByText("View Recipe Card"));
    await screen.findByText("Recipe card URL: http://example.com");
    expect(window.open).toHaveBeenCalledWith("http://example.com", "_blank");
  });
});
