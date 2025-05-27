import { ENDPOINTS } from '../../../api';
import { getEnvVariables } from '../../../helpers';

const { API_URL } = getEnvVariables();
const { PROS_CONS_DISCUSSER_STREAM } = ENDPOINTS;

export const prosConsDiscusserStreamUseCase = async (prompt: string) => {
  try {

    const response = await fetch(`${API_URL + PROS_CONS_DISCUSSER_STREAM}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
      // todo AbortSignal
    });

    if (!response.ok) {
      throw new Error('Request could not be completed');
    }

    const reader = response.body?.getReader();

    if (!reader) {
      console.log('Reader could not be generated');
      return null;
    }

    return reader;

    // const decoder = new TextDecoder();
    // let text = '';

    // // eslint-disable-next-line no-constant-condition
    // while (true) {
    //   const { done, value } = await reader.read();

    //   if (done) {
    //     break;
    //   }

    //   text += decoder.decode(value, { stream: true });
    //   console.log(text)
    // }
  } catch (error) {
    return {
      status: false,
      content: 'Comparative could not be done',
    }
  }
}