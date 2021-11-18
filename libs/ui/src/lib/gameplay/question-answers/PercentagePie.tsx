import { Headline } from '../../typography/Typography';

export interface PercentagePieProps {
    value: number;
    isGroup: boolean;
}

const translateStyle = {
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
}

const PercentagePie: React.FC<PercentagePieProps> = ({ value, isGroup }) => {

    const endDegrees = 360 * (value / 100); // number of degrees the color has to cover
    const gradientColor = isGroup ? '#F2AB3C' : '#914FD2'; // choose between yellow and purple
    const displayValue = Math.round(value);

    return (
        <div className="w-max h-max">
            <Headline className="text-center mb-2 sm:mb-4">{isGroup ? 'Your Group' : 'All Players'}</Headline>
            <div className="w-32 h-32 relative">
                {/* background with color */}
                <div
                    style={{
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: `conic-gradient(${gradientColor} 0deg ${endDegrees}deg, #FCFBFE ${endDegrees}deg 0deg)`
                    }}
                    className="rounded-full z-10 border border-purple-subtle-stroke w-full h-full filter drop-shadow-pie absolute"></div>

                {/* foreground value display */}
                <div
                    style={translateStyle}
                    className={`
                        rounded-full
                        w-3/4
                        h-3/4
                        absolute
                        z-30
                        border
                        border-purple-subtle-stroke
                        bg-purple-subtle-fill
                        filter
                        drop-shadow-pie
                        `}>

                    <div style={translateStyle} className="absolute w-full leading-none">
                        <h2 className="text-center text-3xl font-bold">{displayValue}%</h2>
                        <h3 className="text-center text-md font-bold">Said True</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PercentagePie
