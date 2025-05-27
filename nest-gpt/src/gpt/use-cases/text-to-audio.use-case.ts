import OpenAI from 'openai';
import * as path from 'path';
import * as fs from 'fs';

interface Options {
  prompt: string;
  voice?: string;
}

export const TextToAudioUseCase = async (openai: OpenAI, { prompt, voice }: Options) => {
  const voices = {
    alloy: 'alloy',
    ash: 'ash',
    coral: 'coral',
    echo: 'echo',
    fable: 'fable',
    nova: 'nova',
    onyx: 'onyx',
    sage: 'sage',
    shimmer: 'shimmer',
  };

  const selectedVoice = voices[voice] ?? 'nova';

  // * Temp folder, it would be convenient to store audios in Storage provider
  const nameFile = new Date().getTime();
  const folderPath = path.resolve(__dirname, '../../../generated/audios');
  const speechFile = path.resolve(`${folderPath}/${nameFile}.mp3`);

  // * Create folder recursively
  fs.mkdirSync(folderPath, { recursive: true });

  const mp3 = await openai.audio.speech.create({
    model: 'tts-1',
    voice: selectedVoice,
    input: prompt,
    response_format: 'mp3',
  });

  const buffer = Buffer.from(await mp3.arrayBuffer());
  fs.writeFileSync(speechFile, buffer);

  return {
    prompt,
    selectedVoice,
    speechFile,
  };
};
