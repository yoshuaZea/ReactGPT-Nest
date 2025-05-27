import OpenAI from 'openai';

interface Options {
  prompt: string;
}

export const ProsConsDiscusserStreamUseCase = async (openai: OpenAI, options: Options) => {
  const { prompt } = options;

  return await openai.chat.completions.create({
    stream: true,
    model: 'gpt-4o',
    max_tokens: 1000,
    messages: [
      {
        role: 'system',
        content: `
          Se te dará una pregunta y tu tarea es dar una respuesta con pros y contras,
          los pros y contras deben de estar en una lista,
          Debes de responder en formato Markdown.
        `,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 1,
  });
};
