import './tailwind.css';
import '@fontsource/nunito/400.css';
import '@fontsource/nunito/600.css';
import '@fontsource/nunito/700.css';
import '@fontsource/nunito/800.css';
import '@fontsource/roboto/500.css';
import { store } from '../src/app/store';

export const parameters = {
  controls: { expanded: true },
};

export const loaders = [
  async () => ({
    store,
  }),
];
