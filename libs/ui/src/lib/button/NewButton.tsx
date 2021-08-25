
import tw from 'tailwind-styled-components';

export type ButtonStyle = 'default' | 'big-text' | 'small' | 'inline'

export interface ButtonProps extends React.HtmlHTMLAttributes<React.HtmlHTMLAttributes<HTMLButtonElement>> {
    buttonStyle?: ButtonStyle;
    $secondary?: boolean
}

const defaultButton = tw.button``;


const bigTextButton = tw.button``;
const smallButton = tw.button``;
const inlineButton = tw.button``;

const Button: React.FC<ButtonProps> = ({ buttonStyle, $secondary }) => {
    switch (buttonStyle) {
        case 'big-text':
            return $secondary ? <button></button> : <button></button>
        case 'small':
            return $secondary ? <button></button> : <button></button>
        case 'inline':
            return $secondary ? <button></button> : <button></button>
        default:
            return $secondary ? <button></button> : <button></button>
    }
}

export default Button;