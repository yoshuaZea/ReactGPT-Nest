import { axiosAssistant, ENDPOINTS } from '../../../api'

const { CREATE_THREAD } = ENDPOINTS;

export const createThreadUseCase = async () => {
  try {
      const response = await axiosAssistant.post<Record<string, string>>(CREATE_THREAD);

      if (response.status !== 201) {
        throw new Error('Request could not be completed');
      }

      const { id } = response.data;

      return {
        status: true,
        id,
      }
  
    } catch (error) {
      return {
        status: false,
        message: "Thread couldn't be created",
      }
    }
}