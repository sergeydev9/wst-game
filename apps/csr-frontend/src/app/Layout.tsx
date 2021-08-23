import React from 'react';
import Footer from '../features/footer/Footer';
import NavBar from '../features/navbar/Navbar'

const Layout: React.FC = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <div style={{ backgroundImage: "url('./assets/bg.svg'), linear-gradient(180deg, #6325AD 0%, #411872 100%)" }} className='flex-grow pb-16'>
                <NavBar />
                <main>{children}</main>
            </div>
            <Footer />
        </div>

    )
}

export default Layout;