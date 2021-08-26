import { ReactComponent as WhiteDivider } from './white-divider.svg'
import { ReactComponent as GreyDivider } from './grey-divider.svg'

/**
 * An SVG that can be used as a divider when <hr />
 * elements don't quite work. An example of a scenario where
 * this is useful is when you need to put an element in the middle
 * of a page wide divider without defining the center element
 * via pseudo-selectors.
 *
 * For a live example, see `apps/csr-frontend/features/deck-selection/GuestSelection.tsx`
 *
 * @returns svg
 */
export type DividerColors = 'white' | 'grey';

export interface DividerProps extends React.HtmlHTMLAttributes<React.ReactSVGElement> {
    dividerColor: DividerColors
}

// Firefox will throw a warning about SVGs with rem dimensions.
// This warning can be ignored. It still looks fine.
const Divider: React.FC<DividerProps> = ({ dividerColor }) => {
    return dividerColor === 'white' ? <WhiteDivider width="16rem" height="16rem" /> : <GreyDivider width="4rem" height="4rem" />
}
export default Divider;