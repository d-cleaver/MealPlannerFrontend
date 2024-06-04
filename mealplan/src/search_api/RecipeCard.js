import React, { useState } from "react";
import FavoriteButton from "./FavoriteButton";
import RecipeCardButton from "../CardComponent/RecipeCardButton";
import MealPlanApi from "../api/api";
import RecipeModel from "./RecipeModel";
import "./RecipeCard.css";

const RecipeCard = ({ recipe, isFavorite, onAddFavorite }) => {
  const [showModel, setShowModel] = useState(false);
  const [recipeCardUrl, setRecipeCardUrl] = useState(null);

  const handleImageClick = () => {
    setShowModel(true);
  };

  const handleFavoriteChange = (newFavoriteState) => {
    onAddFavorite(recipe.id, newFavoriteState);
  };

  const handleViewRecipeCard = async () => {
    try {
      // Call the API to fetch the recipe card URL
      const cardResponse = await MealPlanApi.getRecipeCard(recipe.id);
      console.log("Recipe card URL:", cardResponse.url);

      if (cardResponse.url) {
        window.open(cardResponse.url, "_blank"); // Open the recipe card URL in a new tab
      }
      // Update state to store the recipe card URL
      setRecipeCardUrl(cardResponse.url);
    } catch (error) {
      console.error("Error fetching recipe card:", error);
    }
  };

  return (
    <div className="recipe-card">
      <img src={recipe.image} alt={recipe.title} onClick={handleImageClick} />
      <div className="recipe-card-title">
        <h3>{recipe.title}</h3>
      </div>
      <div>
        <FavoriteButton
          recipeId={recipe.id}
          isFavorite={isFavorite}
          onFavoriteChange={handleFavoriteChange}
        />
      </div>
      <div>
        <RecipeCardButton onClick={handleViewRecipeCard} />
      </div>
      <div>
        {showModel && (
          <RecipeModel
            recipeId={recipe.id}
            onClose={() => setShowModel(false)}
            isFavorite={isFavorite}
            onFavoriteChange={handleFavoriteChange}
          />
        )}
      </div>
      {/* Render the recipe card image if URL is available */}
      {recipeCardUrl && (
        <div className="recipe-card-image">
          <img src={recipeCardUrl} alt="Recipe Card" />
        </div>
      )}
    </div>
  );
};

export default RecipeCard;
