import React from "react";

import Layout from "../../../templates/Layout/Layout";
import Header from "../../atoms/Header/Header";
import Account from "../../molecules/Account/Account";

const Profile = ({ session}) => {
  return (
    <div>
      <Header title="Profile" description="Test" />
      <Account session={session} />
    </div>
  );
};

export default Layout(Profile);
