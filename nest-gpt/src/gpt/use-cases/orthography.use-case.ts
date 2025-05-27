import OpenAI from 'openai';

interface Options {
  prompt: string;
  maxTokens: number;
}

export const OrthographyCheckUseCase = async (openai: OpenAI, options: Options) => {
  const { prompt } = options;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 150,
    // max_completion_tokens: maxTokens, // * Delimit cost and reasoning
    messages: [
      {
        role: 'system',
        content: `
          Tu nombre es Jarvis, siempre debes responder amablemente y dar tu nombre.
          El usuario te enviará textos en español con posibles errores ortográficos y gramáticales.
          Las palabras usadas deben existir en el diccionario de la real academia española.
          Tu tarea es corregir y retornar la información correcta.
          También debes dar un porcentaje de acierto al usuario.
          Debes de responder en formato JSON.

          Si no hay errores, debes retornar una felicitación.

          Ejemplo de salida:
          {
            userScore: number,
            errors: string[], // ['error -> solucion']
            message: string, // Usa emojis y textos para felicitar al usuario
          }
        `,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 1, // * Lower values provide more focuesed and deterministic responses,
    response_format: {
      type: 'json_object',
    },
  });

  // console.log(completion);

  const jsonResponse = JSON.parse(completion.choices[0].message.content);

  return jsonResponse;
};
