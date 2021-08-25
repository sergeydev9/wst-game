// import { genTextColor, genBgColor, genBorderColor } from './tailwindHelpers';
// import preset from '../../../../tailwind-workspace-preset';
// import { ThemeColor } from '@whosaidtrue/app-interfaces';


// // These tests are to ensure the helpers are in sync with the
// // theme's colors
// describe('tailwind helpers', () => {
//   let themeColors: ThemeColor[]

//   beforeAll(() => {
//     // get color names from preset, excluding gradient colors.
//     const { colors } = preset.theme.extend;
//     themeColors = Object.keys(colors).filter(color => ['blue-gradient-from', 'blue-gradient-to', 'yellow-gradient-from', 'yellow-gradient-to'].every(exclude => exclude !== color)) as ThemeColor[]
//   })
//   describe('genTextColor', () => {
//     it('should return the input with "text-" added to the start', () => {
//       themeColors.forEach(color => {
//         const textColor = genTextColor(color);
//         expect(textColor).toEqual(`text-${color}`)
//       })
//     });
//   });


//   describe('genBgColor', () => {
//     it('should return the input with "bg-" added to the start', () => {
//       themeColors.forEach(color => {
//         const textColor = genBgColor(color);
//         expect(textColor).toEqual(`bg-${color}`)
//       })
//     })
//   })

//   describe('genBorderColor', () => {
//     it('should return the input with "border-" added to the start', () => {
//       themeColors.forEach(color => {
//         const textColor = genBorderColor(color);
//         expect(textColor).toEqual(`border-${color}`)
//       })
//     })
//   })
// })

// TODO: maybe delete? Newer components are 'dumber', so they don't use the helpers
