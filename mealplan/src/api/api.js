import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 *
 */

class MealPlanApi {
  // the token for interactive with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    // console.debug("API Call:", endpoint, data, method);

    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${MealPlanApi.token}` };
    const params = method === "get" ? data : {};
    console.log("API Call:", endpoint, data, method, headers); // Log header

    try {
      const response = await axios({ url, method, data, params, headers });
      console.debug("API Response:", response); // Log response
      return response.data;
    } catch (err) {
      if (err.response) {
        console.error("API Error Response:", err.response); // Log error response
        let message = err.response.data.error.message;
        throw new Error(Array.isArray(message) ? message.join(", ") : message);
      } else if (err.request) {
        console.error("API Error Request:", err.request); // Log error request
        throw new Error("Network Error");
      } else {
        console.error("API Error without Response:", err); // Log error without response
        throw new Error("An unknown error occurred");
      }
    }
  }

  // Individual API routes

  //************************************************************************************
  // From backend/routes/auth.js

  // Get token for login from username / password
  static async login(data) {
    let res = await this.request(`auth/token`, data, "post");
    return res.token;
  }

  // New User Sign-up
  static async signup(data) {
    let res = await this.request(`auth/register`, data, "post");
    return res.token;
  }

  // //************************************************************************************
  // From backend/routes/search-api.js

  static async searchRecipes(searchTerm, page) {
    const searchURL = new URL("http://localhost:3001/search");
    searchURL.searchParams.append("searchTerm", searchTerm);
    searchURL.searchParams.append("page", page);

    const response = await fetch(searchURL);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  }

  static async getRecipeSummary(recipeId) {
    const summaryURL = new URL(`http://localhost:3001/search/${recipeId}`);
    const summaryResponse = await fetch(summaryURL);

    if (!summaryResponse.ok) {
      throw new Error(`HTTP error! Status: ${summaryResponse.status}`);
    }
    return summaryResponse.json();
  }

  //************************************************************************************
  // From backend/routes/users

  // Get current user.
  static async getCurrentUser(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }

  // Save user profile.
  static async saveProfile(username, data) {
    let res = await this.request(`users/${username}`, data, "patch");
    return res.user;
  }
  //************************************************************************************
  // From backend/routes/favorite.js

  // Get all user favorites for SearchComponent.js.
  static async getUserFavoritesSearch(username) {
    let res = await this.request(`favorites/${username}/favorite`);
    return res.favorites;
  }

  //************************************************************************************
  // Add Favorite Recipe
  static async addFavorite(recipeId) {
    return this.request(`search/favorites`, { recipeId }, "post");
  }

  // Remove Favorite Recipe
  static async removeFavorite(recipeId) {
    return this.request(`search/favorites/${recipeId}`, {}, "delete");
  }
  //************************************************************************************
  // From backend routes/favorites
  static async getRecipeCard(recipeId) {
    console.log("recipeId for card:", recipeId);
    const endpoint = `favorites/${recipeId}/card`;
    const resp = await this.request(endpoint);
    console.log("API Response for getRecipeCard:", resp);
    return resp;
  }
  //************************************************************************************
  // From backend routes/favorites
  // Function to fetch information about multiple recipes by their IDs
  static async getFavoriteRecipesByUser(username) {
    const endpoint = `favorites/${username}`;
    const resp = await this.request(endpoint);
    console.log("API Response for getFavoriteRecipesByUser:", resp);
    return resp;
  }
}

export default MealPlanApi;
