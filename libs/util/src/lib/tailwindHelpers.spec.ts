import { genTextColor, genBgColor, genBorderColor } from './tailwindHelpers';
import { THEME_COLORS } from './colors';

describe('genTextColor', () => {
  it('should return the input with "text-" added to the start', () => {
    THEME_COLORS.forEach(color => {
      const textColor = genTextColor(color);
      expect(textColor).toEqual(`text-${color}`)
    })
  });
});


describe('genBgColor', () => {
  it('should return the input with "bg-" added to the start', () => {
    THEME_COLORS.forEach(color => {
      const textColor = genBgColor(color);
      expect(textColor).toEqual(`bg-${color}`)
    })
  })
})

describe('genBorderColor', () => {
  it('should return the input with "border-" added to the start', () => {
    THEME_COLORS.forEach(color => {
      const textColor = genBorderColor(color);
      expect(textColor).toEqual(`border-${color}`)
    })
  })
})