import tw from 'tailwind-styled-components';
import React from 'react';

export interface QuestionCardProps {
    questionNumber: number;
    totalQuestions: number;
    category: string
}

const Container = tw.div`
    bg-white-ish
    border-0
    rounded-3xl
    filter
    drop-shadow-card
    select-none
    mt-9
    md:mt-12
    md:w-40rem
    md:mx-auto
    sm:mx-8
    mx-2
    pb-12
    mb-36
`

const Body = tw.div`
    p-3
    sm:p-6
    flex
    flex-col
    gap-6
    lg:pl-10
    lg:pr-10
    lg:pb-14
    lg:pt-6
`

const Top = tw.div`
    w-full
    bg-purple-subtle-fill
    text-basic-black
    text-center
    font-bold
    border-b
    border-purple-subtle-stroke
    flex
    flex-col
    justify-center
    text-md
    md:text-lg
    items-center
    rounded-t-3xl
    h-16
    md:h-20
`

const QuestionCard: React.FC<QuestionCardProps> = ({ questionNumber, totalQuestions, category, children }) => {
    return (
        <Container>
            <Top>
                <div>Question {questionNumber} of {totalQuestions}</div>
                <div>{category}</div>
            </Top>
            <Body>
                {children}
            </Body>

        </Container>
    )
}

export default QuestionCard;