import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { NameRequestResponse } from '@whosaidtrue/api-interfaces';
import { api } from '../../api';
import { useAppDispatch } from '../../app/hooks';
import { setRemainingNameOptions, setCurrentNameOptions } from './chooseNameSlice';
import { clearGame } from '../game/gameSlice';

/**
 * Hook to fetch name options. Not really for re-use. Just removes
 * bloat from useEffect.
 */
const useNames = () => {
    const history = useHistory();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const fetchNames = async () => {

            // get 6 name options
            try {
                const response = await api.get<NameRequestResponse>('/names')
                dispatch(setRemainingNameOptions(response.data.names)) // populate total name pool
                dispatch(setCurrentNameOptions()) // set initial set of options and remove them from pool
            } catch (e) {
                history.push('/')
                dispatch(clearGame())
            }
        }

        fetchNames();

    }, [dispatch, history])
}

export default useNames;