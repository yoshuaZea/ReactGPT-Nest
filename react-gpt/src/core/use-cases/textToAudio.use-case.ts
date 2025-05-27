import { axiosClient, ENDPOINTS } from '../../api'

const { TEXT_TO_AUDIO } = ENDPOINTS;

export const textToAudioUseCase = async (prompt: string, voice: string) => {
  try {
    const response = await axiosClient.post(TEXT_TO_AUDIO, {
      prompt,
      voice,
    }, {
      responseType: 'blob',
    });

    if (response.status !== 200) {
      throw new Error('Request could not be completed');
    }
    
    // * Using fetch api
    // const audioFile = await response.data.blob();
    // const audioUrl = URL.createObjectURL(audioFile);
    
    const audioUrl = URL.createObjectURL(response.data);

    return {
      status: true,
      audioUrl,
      message: prompt,
    }

  } catch (error) {
    return {
      status: false,
      message: 'Your text could not be converted to audio',
    }
  }
}