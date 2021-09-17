import tw from 'tailwind-styled-components';

const Base = tw.div`
rounded-full
animate-pulse
absolute
bg-yellow-base
transform
-translate-x-full
`
const Spinner: React.FC = () => {
    return (
        <div className="animate-spin h-28 w-28 relative">
            <Base className="w-7 h-7 tranlate-y-4  left-1/2" />
            <Base className="w-6 h-6 opacity-75 translate-y-6 left-p35" />
            <Base className="w-4 h-4 opacity-50 translate-y-12 left-p35" />
            <Base className="w-2 h-2 opacity-25 translate-y-16 left-p40" />
        </div>
    )
}

export default Spinner;