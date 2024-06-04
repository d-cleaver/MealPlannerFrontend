import React from "react";
import { FaBook } from "react-icons/fa";

const RecipeCardButton = ({ onClick }) => {
  return (
    <button onClick={onClick}>
      <FaBook /> View Recipe Card
    </button>
  );
};

export default RecipeCardButton;
