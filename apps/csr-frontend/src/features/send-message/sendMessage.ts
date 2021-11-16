import { createAsyncThunk } from '@reduxjs/toolkit';
import { EmailRequest } from '@whosaidtrue/api-interfaces';
import { api } from '../../api';

export const sendMessage = createAsyncThunk<void, EmailRequest>(
    'contact/sendMessage',
    async (emailData) => {
        const result = await api.post('/emails', emailData);
        return result.data
    }
)