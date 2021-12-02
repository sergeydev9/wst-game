import { useState } from 'react';
import { FaAngleDown } from '@react-icons/all-files/fa/FaAngleDown';

export interface HostActionsProps {
    actionText?: string;
}

const HostActions: React.FC<HostActionsProps> = ({ actionText, children }) => {
    const [open, setOpen] = useState(true);

    return (
        <section className={`
            bottom-0
            text-basic-black
            text-center
            fixed
            rounded-t-3xl
            pb-5
            bg-purple-subtle-stroke
            flex
            flex-col
            gap-4
            w-11/12
            md:w-96
            pt-2
            px-3
            left-1/2
            right-1/2
            transform
            -translate-x-1/2
            select-none
            transition
            duration-200
            ease-in
            ${!open && 'tranform translate-y-host-action'}
            `}>
            <div>
                <h4 className="font-black text-lg mt-3 inline-block mr-1">Host Actions</h4>

                {/* toggle button */}
                <FaAngleDown
                    onClick={() => setOpen(!open)}
                    className={`
                            ${!open && 'transform rotate-180'}
                            transition
                            duration-200
                            linear
                            inline-block
                            text-3xl
                            font-light
                            cursor-pointer`
                    } />
            </div>
            {actionText && <span className="font-semibold">{actionText}</span>}
            {children}
        </section>

    )
}

export default HostActions;