import * as fs from 'fs';
import OpenAI from 'openai';
import { downloadBase64ImageAsPng, downloadImageAsPng } from 'src/helpers';

interface Options {
  prompt: string;
  originalImage?: string;
  maskImage?: string;
}

export const ImageGenerationUseCase = async (openai: OpenAI, options: Options) => {
  const { prompt, originalImage, maskImage } = options;

  // * IMAGE GENERATION
  if (!originalImage || !maskImage) {
    const response = await openai.images.generate({
      prompt: prompt,
      model: 'dall-e-3',
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      response_format: 'url',
    });

    const fileName = await downloadImageAsPng(response.data[0].url);
    const url = `${process.env.APP_URL}/gpt/image-generation/${fileName}`;

    return {
      url,
      openai_url: response.data[0].url,
      revised_prompt: response.data[0].revised_prompt,
    };
  }

  // * IMAGE EDITION

  // * originalImage = http://localhost:3000/api/gpt/image_generation/1747937951453.png
  // * maskImage = Base64;ASdsadsadsadasdqwdqwdSDASdASdkhBASKDhb
  const pngImagePath = await downloadImageAsPng(originalImage, true);
  const maskPath = await downloadBase64ImageAsPng(maskImage, true);

  const response = await openai.images.edit({
    model: 'dall-e-2',
    prompt: prompt,
    image: fs.createReadStream(pngImagePath),
    mask: fs.createReadStream(maskPath),
    n: 1,
    size: '1024x1024',
    response_format: 'url',
  });

  const fileName = await downloadImageAsPng(response.data[0].url);
  const url = `${process.env.APP_URL}/gpt/image-generation/${fileName}`;

  return {
    url,
    openai_url: response.data[0].url,
    revised_prompt: response.data[0].revised_prompt,
  };
};
