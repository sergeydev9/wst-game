import tw from 'tailwind-styled-components';
import WideBox from '../containers/wide-box/WideBox';
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
lg:w-40rem
sm:w-28rem
mx-auto
`

const Body = tw.div`
p-3
sm:p-6
md:p-10
`

const Top = tw.div`
w-full
bg-purple-subtle-fill
 text-basic-black
 text-center
 font-black
 border-b
 border-purple-subtle-stroke
 flex
 flex-col
 justify-center
 text-lg
 md:text-xl
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