import { Helmet } from 'react-helmet-async';
import { NoFlexBox } from '@whosaidtrue/ui';
import { CreateAccount } from '../../features';

const CreateAccountPage: React.FC = () => {
  const pageTitle = 'Create Account';

  return (
    <>
      <Helmet>
        <title>Who Said True?! - {pageTitle}</title>
      </Helmet>
      <NoFlexBox className="mx-auto w-max">
        <CreateAccount />
      </NoFlexBox>
    </>
  );
};

export default CreateAccountPage;
