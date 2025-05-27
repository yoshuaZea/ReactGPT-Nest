import { useState } from 'react';
import { GptMessage, MyMessage, TextMessageBox, TypingLoader } from '../../components';
import { orthographyUseCase } from '../../../core/use-cases';
import { OrthographyMessage } from '../../components/chat-bubbles';

interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    errors: string[];
    message: string;
    userScore: number;
  }
}

export const OrthographyPage = () => {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const onHandlePost = async (text: string) => {
    setIsLoading(true);
    setMessages((prev) => [
      ...prev,
      {
        text,
        isGpt: false,
      },
    ]);

    const { errors, message, status, userScore } = await orthographyUseCase(text);

    if (!status) {
      setMessages((prev) => [...prev, {
        text: 'No se pudo realizar la corrección',
        isGpt: true,
      }]);
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setMessages((prev) => [...prev, {
        text: message,
        isGpt: true,
        info: {
          errors,
          message,
          userScore,
        },
      }]);
    }

    setIsLoading(false);
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-2 gap-y-2">
          {/* Welcome */}
          <GptMessage text="Hola, puedes escribir tu texto en español y puedo ayudarte con las correcciones" />

          {
            messages.map((message, index) => (
              message.isGpt
                ? (
                  <OrthographyMessage
                    key={index}
                    { ...message.info! }
                  />
                )
                : (
                  <MyMessage key={index} text={message.text} />
                )
            ))
          }

          {
            isLoading && (
              <div className="col-start-1 col-end-12 fade-in">
                <TypingLoader/>
              </div>
            )
          }
        </div>
      </div>

      <TextMessageBox
        onSendMessage={onHandlePost}
        disableCorrections
        placeholder="Escribe tu mensaje..."
      />
    </div>
  )
}
