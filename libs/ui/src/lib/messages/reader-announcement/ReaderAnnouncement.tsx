import { ReactComponent as Callout } from './callout.svg';

const ReaderAnnouncement = () => {
    return (
        <div className="rounded-full filter drop-shadow-mid animate-pulse border-2 gap-3 border-purple-base w-max bg-white px-5 py-1 flex flex-row items-center font-bold"><Callout />Your turn to read</div>
    )
}

export default ReaderAnnouncement;