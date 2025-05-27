import { InternalServerErrorException } from '@nestjs/common';
import OpenAI from 'openai';

interface Options {
  threadId: string;
  runId: string;
}

export const CheckCompleteStatusUseCase = async (openai: OpenAI, options: Options) => {
  const { threadId, runId } = options;

  const runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);

  console.log({ status: runStatus.status });

  if (runStatus.status === 'completed') {
    return runStatus;
  } else if (runStatus.status === 'failed') {
    throw new InternalServerErrorException('Something went wrong with the assistant');
  }

  // * Recursive function
  // * Wait for 2 seconds
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // * Recursive function
  return await CheckCompleteStatusUseCase(openai, options);
};
