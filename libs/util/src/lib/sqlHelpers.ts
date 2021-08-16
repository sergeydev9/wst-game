/**
 * Generic object type used to create update queries via the updateQueryBuilder in @whosaidtrue/util
 */
export type UpdateObject = Record<string, unknown>;

/**
 * Create a SQL update query from an object.
 * The keys of the object will be used as the column names.
 * The values of those keys will be used to set the new value of the column.
 *
 * @example
 * const nameUpdate = {
 *  name: 'New Name'
 * }
 *
 * const query = updateQueryBuilder(nameUpdate);
 *
 * WARNING: DO NOT USE FOR MONEY VALUES WITHOUT CONVERTING MONEY VALUES TO STRING FIRST.
 *
 * console.log(query) // "SET name = 'New Name'"
 *
 * @param {Record<string, unknown} updateObject an object containing the values for the update
 * @returns {string} A SQL query that sets the values specified in the update Object
 */
export const updateQueryBuilder = (updateObject: UpdateObject): string => {
    let queryString = "SET ";

    // loop through keys
    Object.keys(updateObject).forEach(key => {
        let val = updateObject[key];

        // add single quotes around string values
        if (typeof val === 'string') {
            val = `'${val}'`;
        }

        // set undefined to null (postgres doesn't know what undefined is)
        if (val === undefined) {
            val = null;
        }
        // push to query
        queryString += `${key} = ${val}`;
    })

    return queryString;
}