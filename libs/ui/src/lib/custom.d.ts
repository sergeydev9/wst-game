/* eslint-disable @typescript-eslint/ban-types */

declare module '*.svg' {
  import * as React from 'react';
  const content: any;
  export default any; // this lets you use url-loader if you need to
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

  export { ReactComponent }; // this is a workaround so that the typescript compiler stops throwing an error when it sees an SVG
}

declare module '*.webp'; // enable url-loader
declare module '*.png';
declare module '*.jpg';

// Polymorphic type definitions
// REF: https://www.benmvp.com/blog/polymorphic-react-components-typescript/

// Source: https://github.com/emotion-js/emotion/blob/master/packages/styled-base/types/helper.d.ts
// A more precise version of just React.ComponentPropsWithoutRef on its own
declare type PropsOf<
  C extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>
  > = JSX.LibraryManagedAttributes<C, React.ComponentPropsWithoutRef<C>>;

declare type AsProp<C extends React.ElementType> = {
  /**
   * An override of the default HTML tag.
   * Can also be another React component.
   */
  as?: C;
};

/**
 * Allows for extending a set of props (`ExtendedProps`) by an overriding set of props
 * (`OverrideProps`), ensuring that any duplicates are overridden by the overriding
 * set of props.
 */
declare type ExtendableProps<
  ExtendedProps = {},
  OverrideProps = {}
  > = OverrideProps & Omit<ExtendedProps, keyof OverrideProps>;

/**
 * Allows for inheriting the props from the specified element type so that
 * props like children, className & style work, as well as element-specific
 * attributes like aria roles. The component (`C`) must be passed in.
 */
declare type InheritableElementProps<
  C extends React.ElementType,
  Props = {}
  > = ExtendableProps<PropsOf<C>, Props>;

/**
 * A more sophisticated version of `InheritableElementProps` where
 * the passed in `as` prop will determine which props can be included
 */
declare type PolymorphicComponentProps<
  C extends React.ElementType,
  Props = {}
  > = InheritableElementProps<C, Props & AsProp<C>>;
