import React from 'react';

const DeckSet: React.FC = ({ children }) => {
    return (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 justify-items-center">
            {children}
        </div>
    )
}

export default DeckSet;