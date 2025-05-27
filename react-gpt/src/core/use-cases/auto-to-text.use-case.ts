import { axiosClient, ENDPOINTS } from '../../api'
import type { AutoToTextResponse } from '../../interfaces';

const { AUDIO_TO_TEXT } = ENDPOINTS;

export const audioToTextUseText = async (audioFile: File, prompt?: string) => {
  try {

    const formData = new FormData();
    formData.append('file', audioFile);
    
    if (prompt) {
      formData.append('prompt', prompt);
    }


    const response = await axiosClient.post<AutoToTextResponse>(AUDIO_TO_TEXT, formData, {
      headers: {
        'Content-Type' : 'multipart/form-data'
      }
    });

    if (response.status !== 200) {
      throw new Error('Request could not be completed');
    }

    return {
      status: true,
      ...response.data as AutoToTextResponse,
    }

  } catch (error) {
    return {
      status: false,
      message: "Request couldn't complete",
    }
  }
}