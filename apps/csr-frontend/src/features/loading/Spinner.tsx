import DotLoader from 'react-spinners/DotLoader';
import { css } from "@emotion/react";

const loaderOverride = css`
    display: block;
    select: none;
    margin-left: auto;
    margin-right: auto;
    width: 75px;
    user-select: none;
    `

const Spinner: React.FC = () => {
    return <DotLoader color="#F2AB3C" css={loaderOverride} />
}

export default Spinner;