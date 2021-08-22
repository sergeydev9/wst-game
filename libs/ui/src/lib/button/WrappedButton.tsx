import Button from './Button';
import ButtonBackgroundGradient from './ButtonBackgroundGradient';
import { ButtonProps } from './Button';

export type wrappedBtnColor = 'blue' | 'yellow';

export interface btnColorProp {
    color: wrappedBtnColor
}

export type WrappedButtonProps = Omit<ButtonProps, 'color' | '$pill'> & btnColorProp;

const colorHelper = (color: wrappedBtnColor) => color === 'yellow' ? 'yellow-base' : 'blue-base';

const WrappedButton: React.FC<WrappedButtonProps> = ({ color, children, ...rest }) => {

    return (
        <ButtonBackgroundGradient btnColor={color}>
            <Button color={colorHelper(color)} $pill {...rest}>{children}</Button>
        </ButtonBackgroundGradient>
    )
}

export default WrappedButton