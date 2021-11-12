// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../custom.d.ts" />

import React from 'react';
import classNames from 'classnames';
import { overrideTailwindClasses } from 'tailwind-override';
import { ButtonStyles, ButtonInnerStyles } from './Button.styles';

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

  return (
    <Component
      className={overrideTailwindClasses(
        classNames(
          ButtonStyles.DEFAULT,
          {
            [ButtonStyles.BIGTEXT]: buttonStyle === 'big-text',
            [ButtonStyles.SMALL]: buttonStyle === 'small',
            [ButtonStyles.INLINE]: buttonStyle === 'inline',
            [ButtonStyles.SECONDARY]: $secondary,
            [ButtonStyles.SECONDARY_SMALL]:
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
          classNames(ButtonInnerStyles.DEFAULT, {
            [ButtonInnerStyles.BIGTEXT]: buttonStyle === 'big-text',
            [ButtonInnerStyles.SMALL]: buttonStyle === 'small',
            [ButtonInnerStyles.INLINE]: buttonStyle === 'inline',
            [ButtonInnerStyles.SECONDARY]: $secondary,
            [ButtonInnerStyles.SECONDARY_SMALL]:
              buttonStyle === 'small' && $secondary,
            [ButtonInnerStyles.SECONDARY_INLINE]:
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
