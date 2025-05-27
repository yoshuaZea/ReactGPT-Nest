import OpenAI from 'openai';

interface Options {
  threadId: string;
  assistantId?: string;
}

export const CreateRunUseCase = async (openai: OpenAI, options: Options) => {
  const { threadId, assistantId = process.env.OPENAI_ASSISTANT_ID } = options;

  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
    // ! instructions: this overwrite the assistant
  });

  console.log(run);

  return run;
};
