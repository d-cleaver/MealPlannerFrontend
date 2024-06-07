import React, { useState } from "react";
import FavoriteButton from "./FavoriteButton";
// import RecipeCardButton from "../CardComponent/RecipeCardButton";
import RecipeModel from "./RecipeModel";
import "./RecipeCard.css";

const RecipeCard = ({ recipe, isFavorite, onAddFavorite }) => {
  const [showModel, setShowModel] = useState(false);

  const handleImageClick = () => {
    setShowModel(true);
  };

  const handleFavoriteChange = (newFavoriteState) => {
    onAddFavorite(recipe.id, newFavoriteState);
  };

  return (
    <div className="recipe-card">
      <img src={recipe.image} alt={recipe.title} onClick={handleImageClick} />
      <div className="recipe-card-content">
        <h3 className="recipe-card-title">{recipe.title}</h3>
        <div className="recipe-card-buttons">
          <FavoriteButton
            recipeId={recipe.id}
            isFavorite={isFavorite}
            onFavoriteChange={handleFavoriteChange}
          />
          {/* <RecipeCardButton recipeId={recipe.id} /> */}
        </div>
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
    </div>
  );
};

export default RecipeCard;
