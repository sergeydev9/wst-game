import React from 'react';
import './Toggle.css';

const Toggle: React.FC = (props) => {
    return (
        <label className="switch relative inline-block w-20 h-10 mr-4">
            <input {...props} type="checkbox" />
            <span className="slider cursor-pointer inset-0 absolute round rounded-full"></span>
            <span className="on cursor-pointer absolute left-2 bottom-2 text-white text-xs font-medium font-roboto">On</span>
            <span className="off cursor-pointer absolute right-2 bottom-2 text-white text-xs font-medium font-roboto">Off</span>
        </label>
    )
}

export default Toggle;