import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import RecipeModel from "./RecipeModel";
import MealPlanApi from "../api/api";

jest.mock("../api/api");

describe("RecipeModel Component", () => {
  const recipeSummary = {
    title: "Recipe Title",
    summary: "<p>This is a delicious recipe.</p>",
  };

  beforeEach(() => {
    MealPlanApi.getRecipeSummary.mockResolvedValue(recipeSummary);
  });

  it("renders loading initially", () => {
    render(<RecipeModel recipeId={1} onClose={jest.fn()} />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders recipe summary", async () => {
    render(<RecipeModel recipeId={1} onClose={jest.fn()} />);
    await waitFor(() =>
      expect(screen.getByText("Recipe Title")).toBeInTheDocument()
    );
    expect(screen.getByText("This is a delicious recipe.")).toBeInTheDocument();
  });

  it("closes the model on close button click", async () => {
    const handleClose = jest.fn();
    render(<RecipeModel recipeId={1} onClose={handleClose} />);
    await waitFor(() =>
      expect(screen.getByText("Recipe Title")).toBeInTheDocument()
    );
    fireEvent.click(screen.getByText("×"));
    expect(handleClose).toHaveBeenCalled();
  });
});
