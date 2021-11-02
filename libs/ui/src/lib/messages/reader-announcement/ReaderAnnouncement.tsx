import { ReactComponent as Callout } from './callout.svg';

const ReaderAnnouncement: React.FC<React.HtmlHTMLAttributes<HTMLDivElement>> = () => {
    return (
        <div className={`
        absolute
         mx-auto
         top-24
         z-10
         left-0
         right-0
         rounded-full
         filter
         drop-shadow-mid
         animate-pulse
         border-2 gap-3
         border-purple-base
         w-max
         bg-white
         px-5
         py-1
         flex
         flex-row
         items-center
         font-bold`
        }><Callout />Heads Up! It's your turn to read</div>
    )
}

export default ReaderAnnouncement;