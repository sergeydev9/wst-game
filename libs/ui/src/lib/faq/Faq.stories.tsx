import Faq from './Faq';

export default {
    component: Faq,
    title: 'Page Sections/Faq Accordion'
}

export const FaqAccordion = () => (
    <div className="w-max">
        <Faq question='How many licks does it take until you get to the center?' answer='a lot...' />
    </div>
)