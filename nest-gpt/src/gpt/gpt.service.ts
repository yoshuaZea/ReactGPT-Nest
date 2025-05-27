import * as path from 'path';
import * as fs from 'fs';
import OpenAI from 'openai';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  GenerateImageVariationUseCase,
  ImageGenerationUseCase,
  OrthographyCheckUseCase,
  ProsConsDiscusserStreamUseCase,
  ProsConsDiscusserUseCase,
  TextToAudioUseCase,
  TranslateUseCase,
} from './use-cases';
import {
  AudioToTextDto,
  ImageGenerationDto,
  ImageVariationDto,
  OrthographyDto,
  ProsConsDiscusserDto,
  TextToAudioDto,
  TranslateDto,
} from './dto';
import { AutoToTextUseCase } from './use-cases/audio-to-text.use-case';

@Injectable()
export class GptService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // * Invoke use cases only
  async orthographyCheck(orthographyDto: OrthographyDto) {
    return await OrthographyCheckUseCase(this.openai, {
      prompt: orthographyDto.prompt,
      maxTokens: orthographyDto.maxTokens ?? 0,
    });
  }

  async prosConsDiscusser({ prompt }: ProsConsDiscusserDto) {
    return await ProsConsDiscusserUseCase(this.openai, { prompt });
  }

  async prosConsDiscusserStream({ prompt }: ProsConsDiscusserDto) {
    return await ProsConsDiscusserStreamUseCase(this.openai, { prompt });
  }

  async translateText(translateDto: TranslateDto) {
    return await TranslateUseCase(this.openai, translateDto);
  }

  async textToAudio({ prompt, voice }: TextToAudioDto) {
    return await TextToAudioUseCase(this.openai, { prompt, voice });
  }

  textToAudioGetter(fileId: string) {
    const filePath = path.resolve(__dirname, `../../generated/audios/${fileId}.mp3`);
    const wasFound = fs.existsSync(filePath);

    if (!wasFound) {
      throw new NotFoundException(`File ${fileId} not found`);
    }

    return {
      filePath,
    };
  }

  async audioToText(audioFile: Express.Multer.File, audioToTextDto?: AudioToTextDto) {
    const { prompt } = audioToTextDto;
    return await AutoToTextUseCase(this.openai, { prompt, audioFile });
  }

  async imageGeneration(imageGenerationDto: ImageGenerationDto) {
    return await ImageGenerationUseCase(this.openai, { ...imageGenerationDto });
  }

  imageGenerationGetter(imageId: string) {
    const filePath = path.resolve(__dirname, `../../generated/images/${imageId}`);
    const wasFound = fs.existsSync(filePath);

    if (!wasFound) {
      throw new NotFoundException(`File ${imageId} not found`);
    }

    return {
      filePath,
    };
  }

  async generateImageVariation({ baseImage }: ImageVariationDto) {
    return GenerateImageVariationUseCase(this.openai, { baseImage });
  }
}
