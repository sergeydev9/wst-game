import React from 'react';
import tw from 'tailwind-styled-components';

export type ButtonStyle = 'default' | 'big-text' | 'small' | 'inline'

export interface ButtonProps {
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
const Bg = tw.button<BgProps>`
    box-border
    flex
    flex-col
    justify-center
    content-center
    bg-clip-border
    bg-gradient-to-b
    shadow
    w-max
    rounded-full
    ${(p) => (p.btncolor === 'yellow' ? `to-yellow-gradient-to
                                         from-yellow-gradient-from
                                         shadow-yellow` : `to-blue-gradient-to from-blue-gradient-from shadow-blue`
    )}
`

// default
const DefaultButton = tw.button<ChildProps>`
    font-label-big
    font-bold
    m-btn
    active:mx-0
    active:-mb-1
    active:mt-0
    py-3
    px-9
    rounded-full
    active:bg-blue-base
    ${(p) => (p.$secondary ?
        `border-2 border-blue-base text-blue-base bg-white hover:bg-blue-subtle active:text-white` :
        `text-white bg-blue-base hover:bg-blue-light active:shadow-active-blue`
    )}
`;

// big-text
const BigTextButton = tw.button<ChildProps>`
    text-2xl
    font-bold
    m-btn
    active:mx-0
    active:-mb-1
    active:mt-0
    py-2
    px-9
    rounded-full
    active:bg-blue-base
    ${(p) => (p.$secondary ?
        `border-2 border-blue-base text-blue-base bg-white shadow-blue-base active:text-white` :
        `text-white bg-blue-base hover:bg-blue-light active:shadow-active-blue`
    )}
`;

// small
const SmallButton = tw.button<ChildProps>`
    text-headline
    font-bold
    active:m-0
    active:-mb-1
    active:-mx-1
    py-1
    px-3
    rounded-full
    m-btn
    ${(p) => (p.$secondary ?
        `text-yellow-dark bg-yellow-base hover:yellow-light active:shadow-active-yellow` :
        `text-white bg-blue-base hover:bg-blue-light active:shadow-active-blue`
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
        `text-white bg-blue-base hover:bg-blue-light active:shadow-active-blue`
    )}
`;



const Button: React.FC<ButtonProps> = ({ buttonStyle, $secondary, children }) => {

    switch (buttonStyle) {
        case 'big-text':
            return ($secondary ?
                <BigTextButton $secondary>{children}</BigTextButton> :
                <Bg btncolor="blue">
                    <BigTextButton style={{ textShadow: '0px 1px 0px #084AB8' }}>{children}</BigTextButton>
                </Bg>
            )
        case 'small':
            return ($secondary ?
                <Bg btncolor="yellow"><SmallButton $secondary>{children}</SmallButton></Bg> :
                <Bg btncolor="blue"><SmallButton style={{ textShadow: '0px 1px 0px #084AB8' }}>{children}</SmallButton></Bg>
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
                    <DefaultButton style={{ textShadow: '0px 1px 0px #084AB8' }}>{children}</DefaultButton>
                </Bg >
            )
    }
}

export default Button;