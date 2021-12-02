// replaces escaped newline characters and line break tags with unescaped new line characters
function addNewLines(input: string) {
    const p1 = input.replace("\\n", "\n"); // replace doesn't modify in place, so need to  modify successively
    const p2 = p1.replace(/<\/? ?br ?\/?>/, "\n");
    return p2;
}

export default addNewLines;