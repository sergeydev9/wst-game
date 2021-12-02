import tw from 'tailwind-styled-components';
import { Title3, Headline } from '@whosaidtrue/ui';

export const InputHeader = tw(Title3)`
    text-purple-base
    self-center
    text-center
`;

export const InputRow = tw.div`
    flex
    flex-row
    gap-2
    sm:gap-4
    justify-center
    select-none
`;

export const SendAgainText = tw(Headline)`
    text-basic-black
    underline
    self-center
    cursor-pointer
    text-center
`;

export const FormContainer = tw.div`
    w-2/3
    mx-auto
    py-10
    bg-white-ish
    rounded-3xl
    filter
    drop-shadow-card
    items-center
    px-6
    sm:px-10
`;

export const InputContainer = tw.div`
    flex
    flex-col
    gap-8
    rounded-3xl
    my-6
    sm:my-10
    py-6
    sm:py-10
    px-4
    sm:px-8
    bg-purple-subtle-fill
    select-none
`;