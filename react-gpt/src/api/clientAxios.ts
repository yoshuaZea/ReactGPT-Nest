import axios from 'axios';
import { getEnvVariables } from '../helpers';

const { API_URL } = getEnvVariables();


export const axiosClient = axios.create({
  baseURL: API_URL,
});
