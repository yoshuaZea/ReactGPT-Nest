import { useEffect, useRef, useState } from 'react';
import { GptMessage, MyMessage, TypingLoader, TextMessageBox } from '../../components';
import { createThreadUseCase, postQuestionUseCase } from '../../../core/use-cases';

interface Message {
  text: string;
  isGpt: boolean;
}

export const AssistantPage = () => {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [threadId, setThreadId] = useState<string>();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // * Get thread id, if not exist, create it
  useEffect(() => {
    const threadIdExist = localStorage.getItem('threadId');

    if (threadIdExist) {
      setThreadId(threadIdExist);
    } else {
      createThreadUseCase()
        .then((data) => {
          setThreadId(data.id);
          localStorage.setItem('threadId', `${data.id}`);
        });
    }
  }, []);  

  useEffect(() => {
    if (threadId) {
      setMessages((prev) => [...prev, {
        text: `Número de thread: ${threadId}`,
        isGpt: true,
      }]);
    }
  }, [threadId])
  

  useEffect(() => {
    // Auto-scroll to bottom on content update
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const onHandlePost = async (text: string) => {
    // * Thread id validation
    if (!threadId) return;

    setIsLoading(true);
    setMessages((prev) => [
      ...prev,
      {
        text,
        isGpt: false,
      },
    ]);

    const replies = await postQuestionUseCase(threadId, text);
    setIsLoading(false);

    for (const reply of replies.messages!) {
      for (const message of reply.content) {
        setMessages((prev) => [
        ...prev,
        {
          text: message,
          isGpt: (reply.role === 'assistant'),
          info: reply,
        },
      ]);
      }
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-2 gap-y-2">
          {/* Welcome */}
          <GptMessage text="Hola, **soy Jarvis**, ¿en qué puedo ayudarte el día de hoy?" />

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
