import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {

    // users
    pgm.createTable('users', {
        id: 'id',
        email: { type: 'string', notNull: true, unique: true },
        password: { type: 'string', notNull: true },
        status: { type: 'string', notNull: true, default: 'good' },
        accountType: { type: 'string', notNull: true },
        screenName: { type: 'string', notNull: false },
        firstName: { type: 'string', notNull: true },
        lastName: { type: 'string', notNull: true },
        activationCode: { type: 'string', notNull: false, unique: true },
        activated: { type: 'boolean', default: false },
        dob: { type: 'date', notNull: true },
        ipAddress: { type: 'cidr', notNull: false }
    })

    // decks
    pgm.createTable('decks', {
        id: 'id',
        name: { type: 'string', notNull: true },
        sortOrder: { type: 'smallint', notNull: true },
        clean: { type: 'string', notNull: true },
        ageRating: { type: 'string', notNull: true },
        movieRating: { type: 'string', notNull: true },
        SFW: { type: 'string', notNull: true },
        status: { type: 'string', notNull: true },
        description: { type: 'string', notNull: true },
        currentPrice: { type: 'money', notNull: true },
        originalPrice: { type: 'money', notNull: true },
        type: { type: 'string', notNull: true }
    })

    // userDecks
    pgm.createTable('userDecks', {
        id: 'id',
        userId: { type: 'serial', notNull: true, references: 'users' },
        deckId: { type: 'serial', notNull: true, references: 'decks' },
        isFavorite: { type: 'boolean', default: false },
        isSubscribed: { type: 'boolean', default: false }
    })

}

// export async function down(pgm: MigrationBuilder): Promise<void> {
// }
