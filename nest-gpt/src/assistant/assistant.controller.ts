import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AssistantService } from './assistant.service';
import { QuestionDto } from './dto/question.dto';

@Controller('assistant')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Post('create-thread')
  createThread() {
    return this.assistantService.createThread();
  }

  @Post('user-question')
  @HttpCode(200)
  userQuestion(@Body() questionDto: QuestionDto) {
    return this.assistantService.userQuestion(questionDto);
  }
}
