import './tailwind.css'
import '@fontsource/nunito/400.css';
import '@fontsource/nunito/600.css';
import '@fontsource/nunito/700.css';
import '@fontsource/nunito/800.css';
import '@fontsource/roboto/500.css';

// eslint-disable-next-line
import styles from 'react-responsive-carousel/lib/styles/carousel.min.css';

// eslint-disable-next-line
import store from "../src/app/store";

import Layout from '../src/app/Layout'

export const parameters = {
    controls: { expanded: true },
};

// export const decorators = [
//     (Story) => (
//         <Layout>
//           {Story()}
//         </Layout>
//     ),
//   ];