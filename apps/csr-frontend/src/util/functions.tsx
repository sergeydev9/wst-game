import jwt from 'jwt-decode';
import { TokenPayload } from '@whosaidtrue/api-interfaces';
import { Deck } from '@whosaidtrue/app-interfaces';

// This just makes it so the type doesn't have to be re-specified every time
export function decodeUserToken(token: string): { user: TokenPayload } {
  return jwt(token);
}

// express a guess value as a percentage of the total number of players
export function guessAsPercentage(guess: number, totalPlayers: number): string {
  return `${Math.round(100 * (guess / totalPlayers))}%`;
}

// circular index selection from arrays
export function arrayItemAtIndexCircular<T>(items: T[], index: number): T {
  return items[index % items.length];
}

// sort decks in the order required for the regular app
export function sortNotForSchools(decks: Deck[]) {
  return decks.sort((a, b) => {
    // if they have the same movie rating, sort by name
    if (a.movie_rating === b.movie_rating) {
      return a.name < b.name ? -1 : 1;
    }

    // if they don't have the same movie rating, sort in
    // ascending order, with 'PG' < 'PG13 < 'R' < 'NC17'
    if (a.movie_rating === 'PG') {
      return -1;
    }

    if (b.movie_rating === 'PG') {
      return 1;
    }

    // If the function gets here, then we know
    // a and b have different movie ratings, and that neither of
    // those ratings is 'PG'. So we only need to check the next
    // value in the order.
    if (a.movie_rating === 'PG13') {
      return -1;
    }

    if (b.movie_rating === 'PG13') {
      return 1;
    }

    if (a.movie_rating === 'R') {
      return -1;
    }

    if (b.movie_rating === 'R') {
      return 1;
    }

    if (a.movie_rating === 'NC17') {
      return -1;
    }

    if (b.movie_rating === 'NC17') {
      return 1;
    }

    return 0;
  });
}

// sort decks for WST for schools
export function sortForSchools(decks: Deck[]) {
  return decks.sort((a, b) => {
    // if they have the same age rating, sort by name
    if (a.age_rating === b.age_rating) {
      return a.name < b.name ? -1 : 1;
    }

    return a.age_rating < b.age_rating ? -1 : 1;
  });
}
