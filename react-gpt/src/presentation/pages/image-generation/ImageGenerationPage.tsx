import { useEffect, useRef, useState } from 'react';
import { GptMessage, MyMessage, TypingLoader, TextMessageBox } from '../../components';
import { imageGenerationUseCase } from '../../../core/use-cases';
import { GptMessageImage } from '../../components/chat-bubbles';

interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    imageUrl: string,
    alt: string,
  }
}

export const ImageGenerationPage = () => {

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

    const imageInfo = await imageGenerationUseCase(text);
    setIsLoading(false);

    if (!imageInfo) {
      return setMessages((prev) => [...prev, {
        text: 'No se pudo generar la imagen',
        isGpt: true,
      }]);
    }

    setMessages((prev) => [...prev, {
      text,
      isGpt: true,
      info: {
        imageUrl: imageInfo.url,
        alt: imageInfo.alt,
      },
    }]);
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
          <GptMessage text="¿Qué imagen deseas generar hoy?" />

          {
            messages.map((message, index) => (
              message.isGpt
                ? (
                  message.info ? (
                    <GptMessageImage key={index} text={message.text} {...message.info} />
                  ) : (
                    <GptMessage key={index} text={message.text} />
                  )
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
