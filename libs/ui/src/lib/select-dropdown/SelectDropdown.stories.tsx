import SelectDropdown from "./SelectDropdown";
import InputLabel from "../input-label/InputLabel";

export default {
    component: SelectDropdown,
    title: 'Select Dropdown Input'
}

export const SelectDropdownInput = () => {
    return (
        <>
            <InputLabel htmlFor="test-select">Select:</InputLabel>
            <SelectDropdown defaultValue="Option 1" name="test-select">
                <option value="Option 1">Option 1</option>
                <option value="Option 2">Option 2</option>
            </SelectDropdown>
        </>
    )
}