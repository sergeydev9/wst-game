import React from "react";
import { ReactComponent as LogoSVG } from './logo.svg';

const Logo: React.FC<React.HtmlHTMLAttributes<React.ReactSVGElement>> = () => {
    return (
        <LogoSVG className="w-16 h-16" />
    )
}

export default Logo