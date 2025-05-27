import axios from 'axios';
import { getEnvVariables } from '../helpers';

const { ASSISTANT_API_URL } = getEnvVariables();


export const axiosAssistant = axios.create({
  baseURL: ASSISTANT_API_URL,
});
