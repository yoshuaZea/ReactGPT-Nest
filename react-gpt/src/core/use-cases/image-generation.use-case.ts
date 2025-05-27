import { axiosClient, ENDPOINTS } from '../../api'
import type { ImageGenerationResponse } from '../../interfaces';

const { IMAGE_GENERATION } = ENDPOINTS;

type GeneratedImage = Image | null;

interface Image {
  url: string;
  alt: string;
}

export const imageGenerationUseCase = async (prompt: string, originalImage?: string, maskImage?: string): Promise<GeneratedImage> => {
  try {
    const response = await axiosClient.post<ImageGenerationResponse>(IMAGE_GENERATION, {
      prompt,
      originalImage,
      maskImage,
    });

    if (response.status !== 200) {
      throw new Error('Request could not be completed');
    }

    const { url, revised_prompt: alt } = response.data;

    return {
      url,
      alt,
    }

  } catch (error) {
    console.log(error);
    return null;
  }
}