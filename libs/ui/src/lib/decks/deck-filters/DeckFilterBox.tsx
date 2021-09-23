
const DeckFilterBox: React.FC = ({ children }) => {
    return (
        <div className="bg-purple-subtle-fill rounded-2xl flex flex-col pt-2 pb-4 px-4 w-max h-max select-none">
            <h2 className="text-center text-xl mb-1 font-black tracking-wide text-basic-black">Filter Decks</h2>
            <div className="flex flex-col sm:flex-row gap-2">{children}</div>
        </div>
    )
}

export default DeckFilterBox;