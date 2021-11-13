import React from 'react';
import Button from '../Button';
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
        <Button type="button" buttonStyle='small' $secondary onClick={onClick} ><ImSpinner11 className="inline-block mr-3 text-sm" />{rerolls} New Names</Button> :
        <Button type="button" buttonStyle='small' $secondary disabled><span className="text-gray-500">No Rerolls Left!</span></Button>
}

export default RerollNamesButton;
