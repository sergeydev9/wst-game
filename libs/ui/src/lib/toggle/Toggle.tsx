import React from 'react';
import './Toggle.css';

const Toggle: React.FC = (props) => {
    return (
        <label className="toggle-switch relative inline-block w-20 h-10 mr-4">
            <input {...props} type="checkbox" />
            <span className="toggle-slider cursor-pointer inset-0 absolute toggle-round rounded-full"></span>
            <span className="toggle-on cursor-pointer absolute left-3 bottom-3 text-white text-label-small font-medium font-roboto">On</span>
            <span className="toggle-off cursor-pointer absolute right-2 bottom-3 text-white text-label-small font-medium font-roboto">Off</span>
        </label>
    )
}

export default Toggle;