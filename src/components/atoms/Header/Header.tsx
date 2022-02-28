import React, { ReactNode } from "react";

import './Header.scss';

interface HeaderTypes {
  title?: String;
  description?: String;
  action?: ReactNode;
}

function Header({ title, description, action }: HeaderTypes) {
  return (
    <div className="app__header">
      <div className="app__header-content">
        <h1 className="app__header-title">{title}</h1>
        <p className="app__header-description">{description}</p>
      </div>
      <div className="app__header-action">
        {action}
      </div>
    </div>
  );
}

export default Header;
