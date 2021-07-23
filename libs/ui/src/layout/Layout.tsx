import React from "react";

const Layout: React.FC = ({ children }) => {
  // add header and footer
  return (
    <main className="container max-w-md mx-auto flex flex-col justify-between items-center p-8">
      {children}
    </main>
  );
};

export default Layout;
