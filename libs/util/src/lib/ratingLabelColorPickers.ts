import { MovieRating } from '@whosaidtrue/app-interfaces';

export const backgroundColorPicker = (rating: MovieRating | 'ALL' | 'SFW') => {
    switch (rating) {
        case 'PG13':
            return 'bg-yellow-base border-yellow-base';
        case 'PG':
            return 'bg-green-base border-green-base';
        case 'R':
            return 'bg-pink-base border-pink-base';
        case 'SFW':
            return 'bg-blue-base border-blue-base'
        case 'ALL':
            return 'bg-purple-base border-purple-base'
        default:
            return 'bg-purple-base border-purple-base'

    }
}

export const borderAndTextColorPicker = (rating: MovieRating | 'ALL' | 'SFW') => {
    switch (rating) {
        case 'PG13':
            return 'text-yellow-base border-yellow-base'
        case 'PG':
            return 'text-green-base border-green-base'
        case 'R':
            return 'text-pink-base border-pink-base'
        case 'SFW':
            return 'text-blue-base border-blue-base'
        case 'ALL':
            return 'text-purple-base border-purple-base'
        default:
            return 'bg-purple-base border-purple-base'
    }
}