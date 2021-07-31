/**
 * In order to effectively purge styles, tailwind needs
 * full class names to be in the code. This makes constructing
 * styles from variables awkward, since long case statments need to be used
 * instead of template strings. The functions in this module
 * help generate full classnames.
 */
import { ThemeColor } from '@whosaidtrue/app-interfaces';

export const THEME_COLORS: ThemeColor[] = [
  "primary",
  "subtle-stroke",
  "subtle-primary",
  "subtle-bg",
  "basic-black",
  "white-ish",
  "true-white",
  "green-base",
  "green-subtle",
  "green-subtle-stroke",
  "red-base",
  "red-subtle-stroke",
  "red-subtle"
]

/**
 * Create a text color className based on a theme color input.
 *
 * @example
 * genTextColor("primary") // returns "text-primary"
 */
export const genTextColor = (color: ThemeColor) => {
  switch (color) {
    case "primary":
      return "text-primary"
    case "subtle-stroke":
      return "text-subtle-stroke"
    case "subtle-primary":
      return "text-subtle-primary"
    case "subtle-bg":
      return "text-subtle-bg"
    case "basic-black":
      return "text-basic-black"
    case "white-ish":
      return "text-white-ish"
    case "true-white":
      return "text-true-white"
    case "green-base":
      return "text-green-base"
    case "green-subtle-stroke":
      return "text-green-subtle-stroke"
    case "green-subtle":
      return "text-green-subtle"
    case "red-base":
      return "text-red-base"
    case "red-subtle-stroke":
      return "text-red-subtle-stroke"
    case "red-subtle":
      return "text-red-subtle"
    default:
      return "text-primary"
  }
}

/**
 * Create a bg color className that uses the provided theme color name.
 *
 * @example
 * genBgColor("primary") // returns "bg-primary"
 */
export const genBgColor = (color: ThemeColor) => {
  switch (color) {
    case "primary":
      return "bg-primary"
    case "subtle-stroke":
      return "bg-subtle-stroke"
    case "subtle-primary":
      return "bg-subtle-primary"
    case "subtle-bg":
      return "bg-subtle-bg"
    case "basic-black":
      return "bg-basic-black"
    case "white-ish":
      return "bg-white-ish"
    case "true-white":
      return "bg-true-white"
    case "green-base":
      return "bg-green-base"
    case "green-subtle-stroke":
      return "bg-green-subtle-stroke"
    case "green-subtle":
      return "bg-green-subtle"
    case "red-base":
      return "bg-red-base"
    case "red-subtle-stroke":
      return "bg-red-subtle-stroke"
    case "red-subtle":
      return "bg-red-subtle"
    default:
      return "bg-primary"
  }
}

export const genBorderColor = (color: ThemeColor) => {
  switch (color) {
    case "primary":
      return "border-primary"
    case "subtle-stroke":
      return "border-subtle-stroke"
    case "subtle-primary":
      return "border-subtle-primary"
    case "subtle-bg":
      return "border-subtle-bg"
    case "basic-black":
      return "border-basic-black"
    case "white-ish":
      return "border-white-ish"
    case "true-white":
      return "border-true-white"
    case "green-base":
      return "border-green-base"
    case "green-subtle-stroke":
      return "border-green-subtle-stroke"
    case "green-subtle":
      return "border-green-subtle"
    case "red-base":
      return "border-red-base"
    case "red-subtle-stroke":
      return "border-red-subtle-stroke"
    case "red-subtle":
      return "border-red-subtle"
    default:
      return "border-primary"
  }
}