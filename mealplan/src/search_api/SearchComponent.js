import React, { useState, useEffect, useRef, useContext } from "react";
import MealPlanApi from "../api/api";
import LoadingSpinner from "../common/LoadingSpinner";
import RecipeCard from "./RecipeCard";
import RecipeModel from "./RecipeModel";
import UserContext from "../auth/UserContext";

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [error, setError] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(undefined);
  const [favorites, setFavorites] = useState(new Set());
  const pageNumber = useRef(1);
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    const fetchUserFavorites = async () => {
      if (!currentUser) return;

      try {
        const loggedInUsername = currentUser.username;
        console.log("loggedInUsername:", loggedInUsername);
        const favoritesData = await MealPlanApi.getUserFavoritesSearch(
          loggedInUsername
        );
        console.log("favoritesData:", favoritesData);
        if (favoritesData && Array.isArray(favoritesData)) {
          setFavorites(
            new Set(
              favoritesData.map((favorite) => favorite.recipeid || favorite.id)
            )
          );
        } else {
          console.error("Invalid favorites data format:", favoritesData);
        }
      } catch (error) {
        console.error("Error fetching user favorites:", error);
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

  const handleSearch = async (event) => {
    event.preventDefault();
    if (searchTerm.trim() === "") {
      setError("Search term cannot be empty!");
      return;
    }
    setError("");
    setLoading(true);
    setSearchPerformed(true);
    try {
      const response = await MealPlanApi.searchRecipes(searchTerm, 1);
      setRecipes(response.results);
      pageNumber.current = 1;
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const handleViewMoreClick = async () => {
    const nextPage = pageNumber.current + 1;
    try {
      const nextRecipes = await MealPlanApi.searchRecipes(searchTerm, nextPage);
      setRecipes([...recipes, ...nextRecipes.results]);
      pageNumber.current = nextPage;
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="Search col-md-8 offset-md-2">
      <div className="Search-list">
        <div>
          <form onSubmit={handleSearch}>
            <input
              type="text"
              required
              placeholder="Search For a Recipe..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <button type="submit">Submit</button>
          </form>
        </div>
        {error && (
          <p className="lead" style={{ color: "red" }}>
            {error}
          </p>
        )}
        {loading && <LoadingSpinner />}
        {!loading && searchPerformed && recipes.length === 0 && (
          <p className="lead">Sorry, no results were found!</p>
        )}
        {!loading &&
          recipes.length > 0 &&
          recipes.map((recipe) => (
            <div key={recipe.id}>
              <RecipeCard
                recipe={recipe}
                onClick={() => setSelectedRecipe(recipe)}
                isFavorite={favorites.has(recipe.id)}
                onAddFavorite={handleAddFavorite}
                favorites={favorites}
              />
            </div>
          ))}
        {searchPerformed && recipes.length > 0 && (
          <button className="view-more-button" onClick={handleViewMoreClick}>
            View More
          </button>
        )}
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

export default SearchComponent;
