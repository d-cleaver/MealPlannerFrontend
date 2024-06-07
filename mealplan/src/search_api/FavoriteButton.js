import React, { useContext } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import MealPlanApi from "../api/api";
import UserContext from "../auth/UserContext";
import "./FavoriteButton.css";

const FavoriteButton = ({ recipeId, isFavorite, onFavoriteChange }) => {
  const { currentUser } = useContext(UserContext);

  const handleFavoriteClick = async () => {
    if (!currentUser) {
      console.error("Error: currentUser is null or undefined");
      return;
    }

    try {
      if (isFavorite) {
        await MealPlanApi.removeFavorite(recipeId);
      } else {
        await MealPlanApi.addFavorite(recipeId);
      }
      onFavoriteChange(!isFavorite); // Pass the new state to the parent component
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="favorite-icon" onClick={handleFavoriteClick}>
      {isFavorite ? (
        <AiFillHeart color="red" style={{ width: "40px", height: "40px" }} />
      ) : (
        <AiOutlineHeart
          color="grey"
          style={{ width: "40px", height: "40px" }}
        />
      )}
    </div>
  );
};

export default FavoriteButton;
