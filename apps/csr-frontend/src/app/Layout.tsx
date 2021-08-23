import React from 'react';
import Footer from '../features/footer/Footer';
import NavBar from '../features/navbar/Navbar'

const Layout: React.FC = ({ children }) => {
    return (
        <>
            <NavBar />
            <main style={{ backgroundImage: "url('./assets/bg.svg'), linear-gradient(180deg, #6325AD 0%, #411872 100%)" }} className="w-screen">{children}</main>
            <Footer />
        </>
    )
}

export default Layout;