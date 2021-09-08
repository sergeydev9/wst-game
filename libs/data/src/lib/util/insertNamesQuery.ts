import format from 'pg-format'
import generateName from './generateName';

/**
 * Generate a query to insert the specified number of randomly generated
 * names
 *
 * Name has a unique constraint. Can only produce 25,596 unique names. The higher the input number,
 * the longer it will take to find the next unique match. Keep the values
 * low.
 *
 * @param {number} num
 */
const insertNames = (num: number, numNotClean?: number) => {
    let count = num;

    // prevent bad inputs
    if (numNotClean && numNotClean > num) {
        throw new Error('numClean must be less than total')
    }

    if (num > 25596) {
        count = 25596
    } else if (count < 1) {
        count = 1
    }

    const names = new Set() // avoids duplicates
    while (names.size < count) {
        names.add(generateName())
    }

    const input = [];
    let dirtyCount = 0;
    for (const name of names.values()) {

        let clean = true
        if (numNotClean && dirtyCount < numNotClean) {
            clean = false
            dirtyCount++
        }
        input.push([name, clean])
    }

    return {
        text: format('INSERT INTO generated_names (name, clean) VALUES %L RETURNING id', input),
    }
}

export default insertNames;