import FilterBox from './DeckFilterBox';
import FilterButton from './DeckFilterButton'

export default {
    component: FilterBox,
    title: 'Page Sections/Deck Filter Box',
}

export const DeckFilterBox = () => (
    <FilterBox>
        <FilterButton selected={true} filterValue="ALL" />
        <FilterButton selected={false} filterValue="PG" />
        <FilterButton selected={false} filterValue="PG13" />
        <FilterButton selected={false} filterValue="R" />
        <FilterButton selected={false} filterValue="SFW" />
    </FilterBox>
)
