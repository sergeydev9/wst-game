import React from 'react';
import tw from 'tailwind-styled-components';

export type ButtonStyle = 'default' | 'big-text' | 'small' | 'inline'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    buttonStyle?: ButtonStyle;
    $secondary?: boolean
}

interface ChildProps {
    $secondary?: boolean;
}

export interface BgProps {
    btncolor: 'blue' | 'yellow';
}

// A div used to wrap around buttons that have a border effect. Defaults to blue.
const Bg = tw.div<BgProps>`
    bg-gradient-to-b
    rounded-full
    ${(p) => (p.btncolor === 'yellow' ? `active:from-yellow-base
    active:to-yellow-base
    active:shadow-active-yellow
    to-yellow-gradient-to
    from-yellow-gradient-from
    shadow-yellow` :
        `shadow-blue
    to-blue-gradient-to
    from-blue-gradient-from
    active:shadow-none
    active:to-blue-base
    active:from-blue-base
    active:shadow-active-blue`
    )}
`

// default
const DefaultButton = tw.button<ChildProps>`
    font-label-big
    font-bold
    m-btn
    py-3
    px-9
    rounded-full
    active:bg-blue-base
    ${(p) => (p.$secondary ?
        `border-2 border-blue-base text-blue-base bg-white hover:bg-blue-subtle active:text-white` :
        `text-white bg-blue-base hover:bg-blue-light w-p99`
    )}
`;

// big-text
const BigTextButton = tw.button<ChildProps>`
    text-2xl
    font-bold
    m-btn
    py-2
    px-9
    rounded-full
    active:bg-blue-base
    ${(p) => (p.$secondary ?
        `border-2 border-blue-base text-blue-base bg-white shadow-blue-base active:text-white` :
        `text-white bg-blue-base hover:bg-blue-light w-p99`
    )}
`;

// small
const SmallButton = tw.button<ChildProps>`
    text-headline
    font-bold
    py-1
    px-3
    rounded-full
    m-btn
    ${(p) => (p.$secondary ?
        `text-yellow-dark bg-yellow-base hover:yellow-light` :
        `text-white bg-blue-base hover:bg-blue-light`
    )}
`;

// inline
const InlineButton = tw.button<ChildProps>`
    text-label-small
    py-1
    px-2
    font-semibold
    rounded-md
    ${(p) => (p.$secondary ?
        `border-2 border-blue-base text-blue-base bg-white active:bg-blue-base active:text-white` :
        `text-white bg-blue-base hover:bg-blue-light`
    )}
`;



const Button: React.FC<ButtonProps> = ({ buttonStyle, $secondary, children, ...rest }) => {

    switch (buttonStyle) {
        case 'big-text':
            return ($secondary ?
                <BigTextButton $secondary>{children}</BigTextButton> :
                <Bg btncolor="blue">
                    <BigTextButton  {...rest} style={{ textShadow: '0px 1px 0px #084AB8' }}>{children}</BigTextButton>
                </Bg>
            )
        case 'small':
            return ($secondary ?
                <Bg btncolor="yellow"><SmallButton $secondary  {...rest} >{children}</SmallButton></Bg> :
                <Bg btncolor="blue"><SmallButton style={{ textShadow: '0px 1px 0px #084AB8' }}  {...rest}>{children}</SmallButton></Bg>
            )
        case 'inline':
            return ($secondary ?
                <InlineButton $secondary>{children}</InlineButton> :
                <InlineButton style={{ textShadow: '0px 1px 0px #084AB8' }}>{children}</InlineButton>
            )
        default:
            return ($secondary ?
                <DefaultButton $secondary>{children}</DefaultButton> :
                <Bg btncolor="blue">
                    <DefaultButton style={{ textShadow: '0px 1px 0px #084AB8' }}  {...rest}>{children}</DefaultButton>
                </Bg >
            )
    }
}

export default Button;