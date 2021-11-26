import React from 'react';

export interface QuestionContentProps {
  text: string;
  headline: React.ReactNode;
}
const QuestionContent: React.FC<QuestionContentProps> = ({
  text,
  headline,
}) => {
  return (
    <div className="pt-2 text-center sm:px-6 md:px-8 md:pt-0">
      {/*  message for readers/listeners above the question*/}
      <h2 className="font-black mb-2 text-basic-black text-2xl md:text-3xl">
        {headline}
      </h2>
      <div className="mb-2 text-xl md:text-2xl">True or False</div>
      {/* question content */}
      <h3 className="mb-8 text-basic-black text-xl md:text-2xl">{text}</h3>
    </div>
  );
};

export default QuestionContent;
