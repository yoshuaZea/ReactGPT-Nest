import { axiosClient, ENDPOINTS } from '../../../api'
import type { ProsConsResponse } from '../../../interfaces';

const { PROS_CONS_DISCUSSER } = ENDPOINTS;

export const prosConsDiscusserUseCase = async (prompt: string) => {
  try {
    const response = await axiosClient.post<ProsConsResponse>(PROS_CONS_DISCUSSER, {
      prompt,
    });

    if (response.status !== 200) {
      throw new Error('Request could not be completed');
    }

    return {
      status: true,
      ...response.data,
    }

  } catch (error) {
    return {
      status: false,
      content: 'Comparative could not be done',
    }
  }
}