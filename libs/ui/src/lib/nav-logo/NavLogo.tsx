import React from "react";
import { ReactComponent as LogoSVG } from '../assets/logo.svg';

// TODO: Get a better logo
const Logo: React.FC<React.HtmlHTMLAttributes<React.ReactSVGElement>> = () => {
    return (
        <LogoSVG className="w-16 h-16" />
    )
}

export default Logo