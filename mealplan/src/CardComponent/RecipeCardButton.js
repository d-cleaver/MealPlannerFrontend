import React from "react";
import { FaBook } from "react-icons/fa";
import MealPlanApi from "../api/api";
import "./RecipeCardButton.css";

const RecipeCardButton = ({ recipeId }) => {
  const handleClick = async () => {
    try {
      // Fetch the recipe card data
      const response = await MealPlanApi.getRecipeCard(recipeId);

      // If response contains URL, open it in a new tab
      if (response.url) {
        window.open(response.url, "_blank");
      }
    } catch (err) {
      console.error("Error fetching recipe card:", err);
    }
  };

  return (
    <button className="recipe-card-button" onClick={handleClick}>
      <FaBook /> View Recipe Card
    </button>
  );
};

export default RecipeCardButton;
