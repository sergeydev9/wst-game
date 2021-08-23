import tw from "tailwind-styled-components";

export interface BgProps {
    btnColor: 'blue' | 'yellow';
    $pill?: boolean;
}

// A div used to wrap around buttons that have a border effect. Defaults to blue.
export default tw.div<BgProps>`
    py-1
    px-1
    flex
    flex-col
    justify-center
    content-center
    bg-clip-border
    w-max
    bg-gradient-to-b
    shadow
    rounded-full
    ${(p) => p.btnColor === 'yellow' ? 'to-yellow-gradient-to from-yellow-gradient-from shadow-yellow' : 'to-blue-gradient-to from-blue-gradient-from shadow-blue'}
`