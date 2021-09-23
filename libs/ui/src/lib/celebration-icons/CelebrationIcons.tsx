import partypopper from '../assets/party-popper.png';
import confettiball from '../assets/confetti-ball.png';

const CelebrationIcons: React.FC = () => (
    <div className="flex flex-row rounded-full px-6 py-12 bg-white filter drop-shadow-card-container w-max mx-auto">
        <img src={partypopper} alt="party popper" width="50px" height="50px" />
        <img src={confettiball} alt="confetti ball" width="50px" height="50px" />
    </div>
)

export default CelebrationIcons