import { useState } from 'react';
import { GptMessage, MyMessage, TextMessageBox, TypingLoader } from '../../components';
import { prosConsDiscusserUseCase } from '../../../core/use-cases';

interface Message {
  text: string;
  isGpt: boolean;
}

export const ProsConsPage = () => {
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
  
      const { content, status } = await prosConsDiscusserUseCase(text);
  
      if (!status) {
        setMessages((prev) => [...prev, {
          text: 'No se pudo realizar la comparativa',
          isGpt: true,
        }]);
      } else {
        setMessages((prev) => [...prev, {
          text: content,
          isGpt: true,
        }]);
      }
  
      setIsLoading(false);
    }
  
    return (
      <div className="chat-container">
        <div className="chat-messages">
          <div className="grid grid-cols-2 gap-y-2">
            {/* Welcome */}
            <GptMessage text="Hola, puedes escribir algo que desees comparar y te daré mis puntos de vista" />
  
            {
              messages.map((message, index) => (
                message.isGpt
                  ? (
                    <GptMessage key={index} text={message.text} />
                  )
                  : (
                    <MyMessage key={index} text={message.text} />
                  )
              ))
            }
  
            {
              isLoading && (
                <div className="col-start-1 col-end-12 fade-in">
                  <TypingLoader />
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
    );
}
