import './tailwind.css';
import '@fontsource/nunito/400.css';
import '@fontsource/nunito/600.css';
import '@fontsource/nunito/700.css';
import '@fontsource/nunito/800.css';
import '@fontsource/roboto/500.css';

// eslint-disable-next-line
import styles from 'react-responsive-carousel/lib/styles/carousel.min.css';


export const parameters = {
    controls: { expanded: true },
        backgrounds: {
          values: [
            { name: 'purple', value: '#411872' },
          ],
          default: 'purple'
        },
    }