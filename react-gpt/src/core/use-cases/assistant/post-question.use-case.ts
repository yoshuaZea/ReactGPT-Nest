import { axiosAssistant, ENDPOINTS } from '../../../api'
import { QuestionResponse } from '../../../interfaces';

const { USER_QUESTION } = ENDPOINTS;

export const postQuestionUseCase = async (threadId: string, question: string) => {
  try {
      const response = await axiosAssistant.post<QuestionResponse[]>(USER_QUESTION, {
        threadId,
        prompt: question,
      });

      if (response.status !== 200) {
        throw new Error('Request could not be completed');
      }

      return {
        status: true,
        messages: response.data as QuestionResponse[],
      }
  
    } catch (error) {
      return {
        status: false,
        message: "Error posting question",
      }
    }
}