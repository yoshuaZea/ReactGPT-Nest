import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import {
  CheckCompleteStatusUseCase,
  CreateMessageUseCase,
  CreateRunUseCase,
  CreateThreadUseCase,
  GetMessageListUseCase,
} from './use-cases';
import { QuestionDto } from './dto/question.dto';

@Injectable()
export class AssistantService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async createThread() {
    // * 1. Create thread to keep all conversation
    return await CreateThreadUseCase(this.openai);
  }

  async userQuestion({ threadId, prompt }: QuestionDto) {
    // * 2. Create user message before to execute it
    await CreateMessageUseCase(this.openai, {
      threadId,
      question: prompt,
    });

    // * 3. Execute our thread
    const run = await CreateRunUseCase(this.openai, { threadId });

    // * 4. Review run status
    await CheckCompleteStatusUseCase(this.openai, { threadId, runId: run.id });

    // * 5. Get messages after execute the thread
    const messages = await GetMessageListUseCase(this.openai, { threadId });

    return messages.reverse();
  }
}
