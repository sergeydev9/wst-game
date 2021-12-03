import { Helmet } from 'react-helmet-async';
import { Faqs } from '@whosaidtrue/ui';

const Faq: React.FC = () => {
  const pageTitle = 'FAQs';

  return (
    <>
      <Helmet>
        <title>Who Said True?! - {pageTitle}</title>
      </Helmet>
      <div className="w-4/5 mx-auto">
        <Faqs />
      </div>
    </>
  );
};

export default Faq;
