import React, { useState, useEffect, useContext } from "react";
import MealPlanApi from "../api/api";
import LoadingSpinner from "../common/LoadingSpinner";
import RecipeCard from "./RecipeCard";
import RecipeModel from "./RecipeModel";
import UserContext from "../auth/UserContext";
import "./FavoritesComponent.css";
// import "./RecipeCard.css";
// import "./FavoriteButton.css";
// import "../CardComponent/RecipeCardButton.css";

const FavoritesComponent = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(undefined);
  const [favorites, setFavorites] = useState(new Set());
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    const fetchUserFavorites = async () => {
      if (!currentUser) return;

      try {
        const loggedInUsername = currentUser.username;
        console.log("loggedInUsername:", loggedInUsername);
        const favoritesData = await MealPlanApi.getFavoriteRecipesByUser(
          loggedInUsername
        );
        setRecipes(favoritesData.results || []);
        const favoritesSet = new Set(
          favoritesData.results.map((favorite) => favorite.id)
        );
        setFavorites(favoritesSet);
      } catch (error) {
        console.error("Error fetching user favorites:", error);
        setError("Error fetching favorites. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserFavorites();
  }, [currentUser]);

  const handleAddFavorite = (recipeId, isAdding) => {
    const newFavorites = new Set(favorites);
    if (isAdding) {
      newFavorites.add(recipeId);
    } else {
      newFavorites.delete(recipeId);
    }
    console.log("Updated favorites:", newFavorites);
    setFavorites(newFavorites);
  };

  return (
    <div className="Favorites">
      <div className="Favorites-list">
        {error && (
          <p className="lead" style={{ color: "red" }}>
            {error}
          </p>
        )}
        {loading && <LoadingSpinner />}
        {!loading && recipes.length === 0 && (
          <p className="lead">You haven't added any favorites yet!</p>
        )}
        <div className="recipe-cards-container">
          {!loading &&
            recipes.length > 0 &&
            recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => setSelectedRecipe(recipe)}
                isFavorite={favorites.has(recipe.id)}
                onAddFavorite={handleAddFavorite}
                favorites={favorites}
              />
            ))}
        </div>
      </div>
      {selectedRecipe && (
        <RecipeModel
          recipeId={selectedRecipe.id}
          onClose={() => setSelectedRecipe(undefined)}
        />
      )}
    </div>
  );
};

export default FavoritesComponent;
