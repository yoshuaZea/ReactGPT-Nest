import { Response } from 'express';
import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { GptService } from './gpt.service';
import {
  AudioToTextDto,
  ImageGenerationDto,
  ImageVariationDto,
  OrthographyDto,
  ProsConsDiscusserDto,
  TextToAudioDto,
  TranslateDto,
} from './dto';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('orthography-check')
  @HttpCode(200)
  orthographyCheck(@Body() orthographyDto: OrthographyDto) {
    return this.gptService.orthographyCheck(orthographyDto);
  }

  @Post('pros-cons-discusser')
  @HttpCode(200)
  prosConsDicusser(@Body() prosConsDiscusserDto: ProsConsDiscusserDto) {
    return this.gptService.prosConsDiscusser(prosConsDiscusserDto);
  }

  // ! Streams
  @Post('pros-cons-discusser-stream')
  @HttpCode(200)
  async prosConsDicusserStream(@Body() prosConsDiscusserDto: ProsConsDiscusserDto, @Res() res: Response) {
    const stream = await this.gptService.prosConsDiscusserStream(prosConsDiscusserDto);

    // * Data stream response
    res.setHeader('Content-Type', 'application/json');
    res.status(HttpStatus.OK);

    // * Iterate on the stream
    for await (const chunk of stream) {
      const piece = chunk.choices[0].delta.content || '';
      // console.log(piece);
      res.write(piece);
    }

    // * Stream has finished
    res.end();
  }

  @Post('translate')
  @HttpCode(200)
  translate(@Body() translateDto: TranslateDto) {
    return this.gptService.translateText(translateDto);
  }

  @Post('text-to-audio')
  @HttpCode(200)
  async textToAudio(@Body() textToAudioDto: TextToAudioDto, @Res() res: Response) {
    const result = await this.gptService.textToAudio(textToAudioDto);

    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(result.speechFile);
  }

  @Get('text-to-audio/:fileId')
  @HttpCode(200)
  textToAudioGetter(@Param('fileId') fileId: string, @Res() res: Response) {
    const result = this.gptService.textToAudioGetter(fileId);

    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(result.filePath);
  }

  @Post('audio-to-text')
  @HttpCode(200)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './generated/uploads',
        filename(req, file, callback) {
          const fileExtension = file.originalname.split('.').pop();
          const fileName = `${new Date().getTime()}.${fileExtension}`;
          // TODO Validation to avoid upoloading a different file extension than audio
          return callback(null, fileName);
        },
      }),
    }),
  )
  async audioToText(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000 * 1024 * 5, message: 'File is bigger than 5mb' }),
          new FileTypeValidator({ fileType: 'audio/*' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() audioToTextDto: AudioToTextDto,
  ) {
    return this.gptService.audioToText(file, audioToTextDto);
  }

  @Post('image-generation')
  @HttpCode(200)
  async imageGeneration(@Body() imageGenerationDto: ImageGenerationDto) {
    return await this.gptService.imageGeneration(imageGenerationDto);
  }

  @Get('image-generation/:imageId')
  @HttpCode(200)
  imageGenerationGetter(@Param('imageId') imageId: string, @Res() res: Response) {
    const result = this.gptService.imageGenerationGetter(imageId);

    res.setHeader('Content-Type', 'image/png');
    res.status(HttpStatus.OK);
    res.sendFile(result.filePath);
  }

  @Post('image-variation')
  @HttpCode(200)
  async imageVariation(@Body() imageVariationDto: ImageVariationDto) {
    return await this.gptService.generateImageVariation(imageVariationDto);
  }
}
