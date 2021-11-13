enum ButtonStyles {
  DEFAULT = 'group overflow-hidden h-14 font-bold rounded-full text-base text-white bg-gradient-to-b from-blue-gradient-from to-blue-gradient-to select-none active:from-blue-base active:to-blue-base active:shadow-active-blue',
  BIGTEXT = 'text-2xl',
  SMALL = 'h-10',
  INLINE = 'h-6 font-semibold text-sm rounded-md tracking-wider from-blue-base to-blue-base',
  SECONDARY = 'text-blue-base from-blue-base to-blue-base active:shadow-none active:text-white',
  SECONDARY_SMALL = 'text-yellow-darkest from-yellow-gradient-from to-yellow-gradient-to active:from-yellow-base active:to-yellow-base active:shadow-active-yellow active:text-yellow-darkest',
}

enum ButtonInnerStyles {
  DEFAULT = 'flex items-center justify-center w-full h-full border-2 border-b-4 border-transparent rounded-full bg-clip-padding bg-blue-base px-12 whitespace-nowrap hover:bg-blue-light group-active:bg-transparent',
  BIGTEXT = '',
  SMALL = 'px-4',
  INLINE = 'px-2 border-0 border-b-0 rounded-none hover:bg-transparent',
  SECONDARY = 'bg-white hover:bg-blue-subtle group-active:bg-blue-base',
  SECONDARY_SMALL = 'bg-yellow-base hover:bg-yellow-light group-active:bg-yellow-base',
  SECONDARY_INLINE = 'border border-b border-blue-base rounded-md',
}

export { ButtonStyles, ButtonInnerStyles };
