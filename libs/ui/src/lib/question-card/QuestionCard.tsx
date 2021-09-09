import React from 'react';

export interface QuestionCardProps {
    questionNumber: number;
    totalQuestions: number;
    category: string
}

const QuestionCard: React.FC<QuestionCardProps> = ({ questionNumber, totalQuestions, category, children }) => {
    return (
        <section>
            <div>
                <div>Question {questionNumber} of {totalQuestions}</div>
                {category}
            </div>
            {children}
        </section>
    )
}

export default QuestionCard;