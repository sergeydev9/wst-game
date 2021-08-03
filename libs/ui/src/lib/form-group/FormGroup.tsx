import React from 'react';


/**
 * Used for label/input pairs. Applies text-left so that label
 * isn't moved to the center when placed in a text-center
 * styled parent element.
 *
 * @param {*} { children }
 * @return {*}
 */
const FormGroup: React.FC = ({ children }) => {
    return <div className="text-left">{children}</div>
}

export default FormGroup;