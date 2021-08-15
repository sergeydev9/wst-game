import { updateQueryBuilder } from './sqlHelpers';
describe('updateQueryBuilder', () => {

    it('Should add double quotes around string values', () => {
        const update = {
            attribute: 'I am a string'
        }

        const actual = updateQueryBuilder(update);
        expect(actual).toEqual('SET attribute = "I am a string"')
    })

    it('should change undefined into null', () => {
        const update = {
            attribute: undefined
        }

        const actual = updateQueryBuilder(update);
        expect(actual).toEqual('SET attribute = null')
    })
})