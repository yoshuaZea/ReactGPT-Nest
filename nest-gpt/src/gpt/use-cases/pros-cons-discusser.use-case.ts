import OpenAI from 'openai';

interface Options {
  prompt: string;
}

export const ProsConsDiscusserUseCase = async (openai: OpenAI, options: Options) => {
  const { prompt } = options;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 500,
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
    temperature: 1, // * Lower values provide more focuesed and deterministic responses,
  });

  return completion.choices[0].message;
};
