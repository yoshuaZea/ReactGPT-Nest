import { axiosClient, ENDPOINTS } from '../../api'
import type { TranslateResponse } from '../../interfaces';

const { TRANSLATE } = ENDPOINTS;

export const translateUseCase = async (prompt: string, selectedOption: string) => {
  try {
    const response = await axiosClient.post<TranslateResponse>(TRANSLATE, {
      prompt,
      lang: selectedOption,
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
      message: 'Your text could not be translated',
    }
  }
}