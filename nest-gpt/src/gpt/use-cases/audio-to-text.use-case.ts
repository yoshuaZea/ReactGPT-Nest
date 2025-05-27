import OpenAI from 'openai';
import * as fs from 'fs';

interface Options {
  prompt?: string;
  audioFile: Express.Multer.File;
}

export const AutoToTextUseCase = async (openai: OpenAI, { prompt, audioFile }: Options) => {
  console.log({ prompt, audioFile });

  const filePath = fs.createReadStream(audioFile.path);

  const response = await openai.audio.transcriptions.create({
    model: 'whisper-1',
    prompt: prompt, // * It must be the same language than audio
    file: filePath,
    language: 'es',
    // response_format: 'vtt',
    response_format: 'verbose_json',
  });

  return response;
};
