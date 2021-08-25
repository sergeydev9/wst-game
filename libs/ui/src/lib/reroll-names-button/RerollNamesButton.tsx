import React from 'react';
import WrappedButton from '../button/WrappedButton';
import { ImSpinner11 } from '@react-icons/all-files/im/ImSpinner11';


export interface RerollButtonProps extends React.HtmlHTMLAttributes<HTMLButtonElement> {
    rerolls: number,
    onClick: (e: React.MouseEvent) => void
}

/**
 * Gives the option to reroll names if rerolls prop is > 0.
 * If rerolls <= 0, displays a greyed out button that says there are no rerolls left.
 *
 * @param {number} { rerolls }
 * @return {*}
 */
const RerollNamesButton: React.FC<RerollButtonProps> = ({ rerolls, onClick }) => {
    return rerolls > 0 ?
        <WrappedButton type="button" $small fontSize='headline' className="w-40" color="yellow" onClick={onClick} ><ImSpinner11 className="inline-block mr-3 text-xs" />Reroll Names</WrappedButton> :
        <WrappedButton type="button" $small className="w-40" color="yellow" disabled><span className="text-gray-400">No Rerolls Left!</span></WrappedButton>
}

export default RerollNamesButton;