// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../custom.d.ts" />

import React from 'react';
import classNames from 'classnames';
import { overrideTailwindClasses } from 'tailwind-override';
import ButtonStyles from './Button.styles';

type ButtonProps<C extends React.ElementType> = PolymorphicComponentProps<
  C,
  {
    children: React.ReactNode;
    buttonStyle?: 'default' | 'big-text' | 'small' | 'inline';
    $secondary?: boolean;
  }
>;

const Button = <C extends React.ElementType = 'button'>({
  as,
  className,
  children,
  buttonStyle = 'default',
  $secondary,
  ...rest
}: ButtonProps<C>) => {
  const Component = as || 'button';

  const bigTextButtonClassNames = 'text-2xl';

  const smallButtonClassNames = 'h-10';

  const inlineButtonClassNames =
    'h-6 font-semibold text-sm rounded-md tracking-wider from-blue-base to-blue-base';

  const defaultSecondaryButtonClassNames =
    'text-blue-base from-blue-base to-blue-base active:shadow-none active:text-white';

  const defaultSecondarySmallButtonClassNames =
    'text-yellow-darkest from-yellow-gradient-from to-yellow-gradient-to active:from-yellow-base active:to-yellow-base active:shadow-active-yellow active:text-yellow-darkest';

  // SPAN CLASS NAMES
  const defaultSpanClassNames =
    'flex items-center justify-center w-full h-full border-2 border-b-4 border-transparent rounded-full bg-clip-padding bg-blue-base px-12 whitespace-nowrap hover:bg-blue-light group-active:bg-transparent';

  const bigTextSpanClassNames = '';

  const smallSpanClassNames = 'px-4';

  const inlineSpanClassNames =
    'px-2 border-0 border-b-0 rounded-none hover:bg-transparent';

  const defaultSecondarySpanClassNames =
    'bg-white hover:bg-blue-subtle group-active:bg-blue-base';

  const defaultSecondarySmallSpanClassNames =
    'bg-yellow-base hover:bg-yellow-light group-active:bg-yellow-base';

  const defaultSecondaryInlineSpanClassNames =
    'border border-b border-blue-base rounded-md';

  return (
    <Component
      className={overrideTailwindClasses(
        classNames(
          ButtonStyles.DEFAULT,
          {
            [bigTextButtonClassNames]: buttonStyle === 'big-text',
            [smallButtonClassNames]: buttonStyle === 'small',
            [inlineButtonClassNames]: buttonStyle === 'inline',
            [defaultSecondaryButtonClassNames]: $secondary,
            [defaultSecondarySmallButtonClassNames]:
              buttonStyle === 'small' && $secondary,
          },
          className
        )
      )}
      style={{
        textShadow: $secondary ? 'none' : '0px 1px 0px #084AB8',
      }}
      {...rest}
    >
      <span
        className={overrideTailwindClasses(
          classNames(defaultSpanClassNames, {
            [bigTextSpanClassNames]: buttonStyle === 'big-text',
            [smallSpanClassNames]: buttonStyle === 'small',
            [inlineSpanClassNames]: buttonStyle === 'inline',
            [defaultSecondarySpanClassNames]: $secondary,
            [defaultSecondarySmallSpanClassNames]:
              buttonStyle === 'small' && $secondary,
            [defaultSecondaryInlineSpanClassNames]:
              buttonStyle === 'inline' && $secondary,
          })
        )}
      >
        {children}
      </span>
    </Component>
  );
};

export default Button;
