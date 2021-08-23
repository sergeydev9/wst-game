import Button from './Button';
import ButtonBackgroundGradient from './ButtonBackgroundGradient';
import { ButtonProps, FontSize, BorderThickness } from './Button';

export type wrappedBtnColor = 'blue' | 'yellow';


export interface WrappedButtonProps extends React.HtmlHTMLAttributes<HTMLButtonElement> {
    color: wrappedBtnColor;
    disabled?: boolean;
    fontSize?: FontSize;
    border?: BorderThickness;
    $small?: boolean;
    $pill?: boolean;
    type: 'button' | 'submit' | 'reset' | undefined;
}

const colorHelper = (color: wrappedBtnColor) => color === 'yellow' ? 'yellow-base' : 'blue-base';

const WrappedButton: React.FC<WrappedButtonProps> = ({ color, children, ...rest }) => {

    return (
        <ButtonBackgroundGradient btncolor={color}>
            <Button color={colorHelper(color)} $pill {...rest}>{children}</Button>
        </ButtonBackgroundGradient>
    )
}

export default WrappedButton