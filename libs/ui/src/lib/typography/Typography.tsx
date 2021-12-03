/**
 * Text elements that match the specificaions in the design system.
 *
 * Font sizes are defined in the root `tailwind-workspace-preset.js`.
 * These components just combine the sizes and weights to produce
 * what is in the design spec.
 */
import tw from "tailwind-styled-components";

export const LargeTitle = tw.h1`
    text-large-title
    font-extrabold
`

export const Title1 = tw.h2`
    text-title-1
    font-bold
`

export const Title2 = tw.h3`
    text-title-2
    font-bold
`

export const Title3 = tw.h4`
    text-title-3
    font-bold
`

// Body elements may or may not be paragraphs. Span is used to prevent
// any positioning styles from being applied. Only want these components
// to set font size and weight.
export const BodyLarge = tw.span`
    text-body-large
    font-normal
`

export const BodyMedium = tw.span`
    text-body-medium
    font-normal
`
// The SelectDropdown component uses this same style.
// Should keep these in sync.
export const BodySmall = tw.span`
    text-body-small
    font-semibold
`

export const Headline = tw.h4`
    text-headline
    font-bold
`

export const LabelBig = tw.label`
    text-label-big
    font-medium
`

export const LabelSmall = tw.label`
    text-label-small
    font-medium
`

export const GameCodeText = tw.span`
    font-extrabold
    text-4xl
    text-basic-black
    tracking-widest
    uppercase
`
