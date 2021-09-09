export interface HostActionsProps {
    actionText: string
}

const HostActions: React.FC<HostActionsProps> = ({ actionText, children }) => {
    return (
        <section className={`
            text-basic-black
            text-center
            fixed bottom-0
            rounded-t-3xl
            pb-10
            bg-purple-subtle-fill
            flex
            flex-col
            gap-4
            w-11/12
            md:w-max
            pt-2
            px-3
            left-1/2
            right-1/2
            transform
            -translate-x-1/2
            select-none
            `}>
            <h4 className="font-black text-lg mt-3">Host Actions</h4>
            <span className="font-semibold">{actionText}</span>
            {children}
        </section>

    )
}

export default HostActions;