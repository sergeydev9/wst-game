import {
  FlashMessage,
  FullScreenModalController,
  ScoreTooltip,
  Reconnecting,
  TakingTooLong,
  HostSkippedQuestion
} from '../features';
import Footer from '../features/footer/Footer';
import NavBar from '../features/navbar/Navbar';

const Layout: React.FC = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <div
        className="flex-grow pb-16 w-full bg-repeat"
        style={{
          backgroundImage:
            "url('./assets/bg.svg'), linear-gradient(180deg, #431975 0%, #331359 100%)",
        }}
      >
        <HostSkippedQuestion />
        <TakingTooLong />
        <NavBar />
        <Reconnecting />
        <ScoreTooltip />
        <FlashMessage />
        <FullScreenModalController />
        <main>{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
