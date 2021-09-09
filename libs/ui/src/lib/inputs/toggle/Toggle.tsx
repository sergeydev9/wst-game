import React from 'react';
import './Toggle.css';

const Toggle: React.FC = (props) => {
    return (
        <label className="toggle-switch relative inline-block w-20 h-10 mr-4 select-none">
            <input {...props} type="checkbox" />
            <span className="toggle-slider cursor-pointer inset-0 absolute toggle-round rounded-full select-none"></span>
            <span className="toggle-on cursor-pointer absolute left-3 bottom-3 text-white text-label-small font-medium font-roboto select-none">On</span>
            <span className="toggle-off cursor-pointer absolute right-2 bottom-3 text-white text-label-small font-medium font-roboto select-none">Off</span>
        </label>
    )
}

export default Toggle;