import callout from '../../assets/callout.svg';

const ReaderAnnouncement: React.FC<React.HtmlHTMLAttributes<HTMLDivElement>> =
  () => {
    return (
      <div
        className={`
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
         max-w-full
         bg-white
         px-5
         py-2
         flex
         items-center
         font-bold
         whitespace-nowrap
         overflow-hidden`}
      >
        <img className="block w-6 h-6 -mt-0.5" src={callout} alt="Callout" />
        <span className="overflow-hidden overflow-ellipsis">
          Heads Up! It's your turn to read
        </span>
      </div>
    );
  };

export default ReaderAnnouncement;
