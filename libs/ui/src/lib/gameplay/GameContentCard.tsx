import Box from '../containers/box/Box';

const GameContentCard: React.FC<React.HtmlHTMLAttributes<HTMLDivElement>> = ({ children, ...rest }) => {

    return (
        <Box
            boxstyle="purple-subtle"
            className="p-3 md:p-6 filter drop-shadow-card-container"
            {...rest}>
            {children}
        </Box>
    )
}

export default GameContentCard