import { Helmet } from 'react-helmet-async';

const Thanks: React.FC = () => {
  const pageTitle = 'Thanks!';

  return (
    <>
      <Helmet>
        <title>Who Said True?! - {pageTitle}</title>
      </Helmet>
      <h1 className="text-4xl font-black text-yellow-base text-center w-full select-none">
        Thank you for your input!
      </h1>
    </>
  );
};

export default Thanks;
