import { useEffect, useRef, useState } from 'react';
import { GptMessage, MyMessage, TypingLoader, TextMessageBox } from '../../components';


interface Message {
  text: string;
  isGpt: boolean;
}

export const ChatTemplate = () => {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const onHandlePost = async (text: string) => {
    setIsLoading(true);
    setMessages((prev) => [
      ...prev,
      {
        text,
        isGpt: false,
      },
    ]);

    // TODO Use case

    setIsLoading(false);

    // TODO Add GPT message
  }

  useEffect(() => {
    // Auto-scroll to bottom on content update
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
                  <GptMessage key={index} text={message.text} />
                )
                : (
                  <MyMessage key={index} text={message.text} />
                )
            ))
          }

          <div ref={bottomRef}></div>

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
