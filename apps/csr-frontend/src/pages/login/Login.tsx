import { Helmet } from 'react-helmet-async';
import { NoFlexBox } from '@whosaidtrue/ui';
import { Login } from '../../features';

const LoginPage: React.FC<React.HtmlHTMLAttributes<HTMLDivElement>> = () => {
  const pageTitle = 'Log In';

  return (
    <>
      <Helmet>
        <title>Who Said True?! - {pageTitle}</title>
      </Helmet>
      <NoFlexBox className="w-96 mx-auto">
        <Login />
      </NoFlexBox>
    </>
  );
};

export default LoginPage;
