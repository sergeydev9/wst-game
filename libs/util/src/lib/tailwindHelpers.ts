/**
 * In order to effectively purge styles, tailwind needs
 * full class names to be in the code (i.e. no string concatenation). This makes constructing
 * styles from variables awkward, since long case statments need to be used
 * instead of template strings. The functions in this module
 * help generate full classnames.
 *
 * See the first section in https://tailwindcss.com/docs/optimizing-for-production
 */
import { ThemeColor } from '@whosaidtrue/app-interfaces';

/**
 * Create a text color className based on a theme color input.
 *
 * @example
 * genTextColor('purple-light') // returns "text-primary"
 */
export const genTextColor = (color: ThemeColor) => {
  switch (color) {
    case 'purple-light':
      return 'text-purple-light'
    case 'purple-base':
      return 'text-purple-base'
    case 'purple-dark':
      return 'text-purple-dark'
    case 'purple-subtle-fill':
      return 'text-purple-subtle-fill'
    case 'purple-subtle-stroke':
      return 'text-purple-subtle-stroke'
    case 'purple-card-bg':
      return 'text-purple-card-bg'
    case 'yellow-base':
      return 'text-yellow-base'
    case 'yellow-dark':
      return 'text-yellow-dark'
    case 'blue-base':
      return 'text-blue-base'
    case 'white-ish':
      return 'text-white-ish'
    case 'true-white':
      return 'text-true-white'
    case 'basic-black':
      return 'text-basic-black'
    case 'basic-gray':
      return 'text-basic-gray'
    case 'light-gray':
      return 'text-light-gray'
    case 'green-base':
      return 'text-green-base'
    case 'green-subtle-stroke':
      return 'text-green-subtle-stroke'
    case 'green-subtle-fill':
      return 'text-green-subtle-fill'
    case 'red-base':
      return 'text-red-base'
    case 'red-subtle-stroke':
      return 'text-red-subtle-stroke'
    case 'red-subtle-fill':
      return 'text-red-subtle-fill'
    case 'red-light':
      return 'text-red-light'
    default:
      return 'text-purple-base'
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
    case 'purple-light':
      return 'bg-purple-light'
    case 'purple-base':
      return 'bg-purple-base'
    case 'purple-dark':
      return 'bg-purple-dark'
    case 'purple-subtle-fill':
      return 'bg-purple-subtle-fill'
    case 'purple-subtle-stroke':
      return 'bg-purple-subtle-stroke'
    case 'purple-card-bg':
      return 'bg-purple-card-bg'
    case 'yellow-base':
      return 'bg-yellow-base'
    case 'yellow-dark':
      return 'bg-yellow-dark'
    case 'blue-base':
      return 'bg-blue-base'
    case 'white-ish':
      return 'bg-white-ish'
    case 'true-white':
      return 'bg-true-white'
    case 'basic-black':
      return 'bg-basic-black'
    case 'basic-gray':
      return 'bg-basic-gray'
    case 'light-gray':
      return 'bg-light-gray'
    case 'green-base':
      return 'bg-green-base'
    case 'green-subtle-stroke':
      return 'bg-green-subtle-stroke'
    case 'green-subtle-fill':
      return 'bg-green-subtle-fill'
    case 'red-base':
      return 'bg-red-base'
    case 'red-subtle-stroke':
      return 'bg-red-subtle-stroke'
    case 'red-subtle-fill':
      return 'bg-red-subtle-fill'
    case 'red-light':
      return 'bg-red-light'
    default:
      return 'bg-purple-base'
  }
}

export const genBorderColor = (color: ThemeColor) => {
  switch (color) {
    case 'purple-light':
      return 'border-purple-light'
    case 'purple-base':
      return 'border-purple-base'
    case 'purple-dark':
      return 'border-purple-dark'
    case 'purple-subtle-fill':
      return 'border-purple-subtle-fill'
    case 'purple-subtle-stroke':
      return 'border-purple-subtle-stroke'
    case 'purple-card-bg':
      return 'border-purple-card-bg'
    case 'yellow-base':
      return 'border-yellow-base'
    case 'yellow-dark':
      return 'border-yellow-dark'
    case 'blue-base':
      return 'border-blue-base'
    case 'white-ish':
      return 'border-white-ish'
    case 'true-white':
      return 'border-true-white'
    case 'basic-black':
      return 'border-basic-black'
    case 'basic-gray':
      return 'border-basic-gray'
    case 'light-gray':
      return 'border-light-gray'
    case 'green-base':
      return 'border-green-base'
    case 'green-subtle-stroke':
      return 'border-green-subtle-stroke'
    case 'green-subtle-fill':
      return 'border-green-subtle-fill'
    case 'red-base':
      return 'border-red-base'
    case 'red-subtle-stroke':
      return 'border-red-subtle-stroke'
    case 'red-subtle-fill':
      return 'border-red-subtle-fill'
    case 'red-light':
      return 'border-red-light'
    default:
      return 'border-purple-base'
  }
}