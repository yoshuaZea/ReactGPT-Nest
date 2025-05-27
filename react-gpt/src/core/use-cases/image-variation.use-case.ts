import { axiosClient, ENDPOINTS } from '../../api'

const { IMAGE_VARIATION } = ENDPOINTS;

type GeneratedImage = Image | null;

interface Image {
  url: string;
  alt: string;
}

export const imageVariationUseCase = async (baseImage: string): Promise<GeneratedImage> => {
  try {
    const response = await axiosClient.post(IMAGE_VARIATION, {
      baseImage,
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