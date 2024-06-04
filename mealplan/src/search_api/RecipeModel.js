import React, { Fragment, useState, useEffect } from "react";
import MealPlanApi from "../api/api";
import "./RecipeModel.css";
import FavoriteButton from "./FavoriteButton";

const RecipeModel = ({ recipeId, onClose, isFavorite, onFavoriteChange }) => {
  const [recipeSummary, setRecipeSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipeSummary = async () => {
      try {
        const recipeSummaryData = await MealPlanApi.getRecipeSummary(recipeId);
        setRecipeSummary(recipeSummaryData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeSummary();
  }, [recipeId]);

  if (loading || !recipeSummary) {
    return <div>Loading...</div>;
  }

  return (
    <Fragment>
      <div className="overlay"></div>
      <div className="model">
        <div className="model-content">
          <div className="model-header">
            <h2>{recipeSummary.title}</h2>
            <span className="close-btn" onClick={onClose}>
              &times;
            </span>
          </div>
          <p dangerouslySetInnerHTML={{ __html: recipeSummary.summary }}></p>
          <FavoriteButton
            recipeId={recipeId}
            isFavorite={isFavorite}
            onFavoriteChange={onFavoriteChange}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default RecipeModel;
