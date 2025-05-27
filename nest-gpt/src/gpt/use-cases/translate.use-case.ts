import OpenAI from 'openai';

interface Options {
  prompt: string;
  lang: string;
}

export const TranslateUseCase = async (openai: OpenAI, options: Options) => {
  const { lang, prompt } = options;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 200,
    messages: [
      {
        role: 'system',
        content: `
          Traduce el siguiente texto al idioma ${lang}: ${prompt}
        `,
      },
    ],
    temperature: 0.2,
  });

  return {
    message: completion.choices[0].message.content,
    lang,
    originalText: prompt,
  };
};
