import { MovieRating } from '@whosaidtrue/app-interfaces';

export const backgroundColorPicker = (rating: MovieRating | 'all') => {
    switch (rating) {
        case 'PG13':
            return 'bg-yellow-base';
        case 'PG':
            return 'bg-green-base';
        case 'R':
            return 'bg-pink-base';
        case 'all':
            return 'bg-purple-base'
    }
}

export const borderAndTextColorPicker = (rating: MovieRating | 'all') => {
    switch (rating) {
        case 'PG13':
            return 'text-yellow-base border-yellow-base'
        case 'PG':
            return 'text-green-base border-green-base'
        case 'R':
            return 'text-pink-base border-pink-base'
        case 'all':
            return 'text-purple-base border-purple-base'
    }
}