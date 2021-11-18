// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../custom.d.ts" />

import React, { forwardRef } from 'react';
import classNames from 'classnames';
import './Button.css';

export type ButtonProps<C extends React.ElementType> =
  PolymorphicComponentProps<
    C,
    {
      children: React.ReactNode;
      buttonStyle?: 'default' | 'big-text' | 'small' | 'inline';
      $secondary?: boolean;
    }
  >;

const Button = forwardRef(
  <C extends React.ElementType = 'button'>(
    {
      as,
      className,
      children,
      buttonStyle = 'default',
      $secondary,
      ...rest
    }: ButtonProps<C>,
    ref: React.LegacyRef<HTMLButtonElement> | undefined
  ) => {
    const Component = as || 'button';

    const componentClassName = classNames(
      'button',
      {
        'button--small': buttonStyle === 'small',
        'button--inline': buttonStyle === 'inline',
        'button--secondary': $secondary,
      },
      className
    );

    return (
      <Component className={componentClassName} ref={ref} {...rest}>
        <span>{children}</span>
      </Component>
    );
  }
);

export default Button;
