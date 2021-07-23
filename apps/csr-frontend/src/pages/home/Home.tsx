import React from "react";
import { Link } from "react-router-dom";

// local imports
import { Heading } from "@whosaidtrue/ui";
import { ROUTES } from "../../util/constants";

const Home: React.FC = () => {
  return (
    <>
      <Heading>Hello!</Heading>
      <Link className="text-blue-900 underline" to={ROUTES.logout}>
        Logout
      </Link>
    </>
  );
};

export default Home;
