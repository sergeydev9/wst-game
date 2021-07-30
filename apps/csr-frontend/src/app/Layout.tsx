import React from 'react';
import Footer from '../features/footer/Footer';
import NavBar from '../features/navbar/Navbar'


const Layout: React.FC = ({ children }) => {
    return (
        <>
            <NavBar />
            <main className="w-screen">{children}</main>
            <Footer />
        </>
    )
}

export default Layout;