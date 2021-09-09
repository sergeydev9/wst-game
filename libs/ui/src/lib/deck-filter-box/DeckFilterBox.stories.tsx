import FilterBox from './DeckFilterBox';
import FilterButton from './DeckFilterButton'

export default {
    component: FilterBox,
    title: 'Page Sections/Deck Filter Box',
}

export const DeckFilterBox = () => (
    <FilterBox>
        <FilterButton selected={false}>PG-Rated</FilterButton>
        <FilterButton selected={false}>PG-13-Rated</FilterButton>
        <FilterButton selected={true}>R-Rated</FilterButton>
        <FilterButton selected={false}>Work Friendly</FilterButton>
    </FilterBox>
)
