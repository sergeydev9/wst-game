import SelectDropdownComponent from "./SelectDropdown";
import InputLabel from "../input-label/InputLabel";

export default {
    component: SelectDropdownComponent,
    title: 'Inputs/Select Dropdown'
}

export const SelectDropdown = () => {
    return (
        <div className="w-64">
            <InputLabel htmlFor="test-select">Select:</InputLabel>
            <SelectDropdownComponent defaultValue="Option 1" name="test-select">
                <option value="Option 1">Option 1</option>
                <option value="Option 2">Option 2</option>
            </SelectDropdownComponent>
        </div>
    )
}