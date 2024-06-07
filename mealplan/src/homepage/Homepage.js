import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./Homepage.css";
import UserContext from "../auth/UserContext";

/** Homepage of site.
 *
 * Shows welcome message or login/register buttons.
 *
 * Routed at /
 *
 * Routes -> Homepage
 */

function Homepage() {
  const { currentUser } = useContext(UserContext);
  console.debug("Homepage", "currentUser=", currentUser);

  return (
    <div className="Homepage">
      <div className="container text-center">
        <h1 className="mb-4 font-weight-bold">Flavorite Flavors</h1>
        <p className="lead">"Favorite Flavors, Every Time!"</p>
        {currentUser ? (
          <>
            <h2>
              Welcome Back, {currentUser.firstName || currentUser.username}!
            </h2>
            <Link
              className="btn btn-success font-weight-bold mt-3"
              to="/search"
            >
              Take Me To FlavorTown!!
            </Link>
          </>
        ) : (
          <p>
            <Link className="btn btn-primary font-weight-bold mr-3" to="/login">
              Log in
            </Link>
            <Link className="btn btn-primary font-weight-bold" to="/signup">
              Sign up
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default Homepage;
