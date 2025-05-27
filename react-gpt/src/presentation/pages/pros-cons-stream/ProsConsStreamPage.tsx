import { useEffect, useRef, useState } from 'react';
import { GptMessage, MyMessage, TypingLoader, TextMessageBox } from '../../components';
import { prosConsStreamGeneratorUseCase } from '../../../core/use-cases';


interface Message {
  text: string;
  isGpt: boolean;
}

export const ProsConsStreamPage = () => {
  const abortController = useRef(new AbortController());
  const isRunning = useRef(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const onHandlePost = async (text: string) => {

    if (isRunning.current) {
      abortController.current.abort();
      abortController.current = new AbortController();
    }

    setIsLoading(true);
    isRunning.current = true;
    setMessages((prev) => [...prev, { text, isGpt: false }]);

    // * Function generator
    const stream = prosConsStreamGeneratorUseCase(text, abortController.current.signal);
    setIsLoading(false);
    
    setMessages((prev) => [...prev, { text: '', isGpt: true, }]);

    for await (const text of stream) {
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].text = text;
        return newMessages;
      });
    }

    isRunning.current = false;
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
          <GptMessage text="Hola, ¿qué deseas comparar hoy?" />

          {
            messages.map(({ text, isGpt }, index) => (
              isGpt
                ? (
                  <>
                    <GptMessage key={index} text={text} />
                  </>
                )
                : (
                  <MyMessage key={index} text={text} />
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
