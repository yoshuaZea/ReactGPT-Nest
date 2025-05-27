import { axiosClient, ENDPOINTS } from '../../api'
import type { OrthorgraphyResponse } from '../../interfaces';

const { ORTHOGRAPHY_CHECK } = ENDPOINTS;

export const orthographyUseCase = async (prompt: string) => {
  try {
    const response = await axiosClient.post<OrthorgraphyResponse>(ORTHOGRAPHY_CHECK, {
      prompt,
    });

    if (response.status !== 200) {
      throw new Error('Request could not be completed');
    }

    return {
      status: true,
      ...response.data as OrthorgraphyResponse,
    }

  } catch (error) {
    return {
      status: false,
      message: "Request couldn't complete",
    }
  }
}