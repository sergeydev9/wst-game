import addNewLines from "./addNewLines";

describe('addNewLines', () => {

    it('should work for current variations of break tag in db', async () => {
        const actual = ["\\n", "<br>", "<br/>", "<br />", "</br>"];

        actual.forEach(s =>
            expect(addNewLines(s)).toEqual("\n")
        );
    })

})