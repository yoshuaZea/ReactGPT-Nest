import { useEffect, useRef, useState } from 'react';
import { GptMessage, MyMessage, TypingLoader, TextMessageFile } from '../../components';
import { audioToTextUseText } from '../../../core/use-cases';

interface Message {
  text: string;
  isGpt: boolean;
}

export const AudioToTextPage = () => {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const onHandlePost = async (text: string, audioFile: File) => {
    setIsLoading(true);
    setMessages((prev) => [
      ...prev,
      {
        text,
        isGpt: false,
      },
    ]);

    const response = await audioToTextUseText(audioFile, text);
    setIsLoading(false);

    if (!response.status) {
      setMessages((prev) => [...prev, {
        text: response.message!,
        isGpt: true,
      }]);
      return;
    }

    const gptMessage = `
## Transcripción:
__Duración:__ ${ Math.round( response.duration )  } segundos
## El texto es:
${ response.text }
    `;

    setMessages((prev) => [
      ...prev,
      {
        isGpt: true,
        text: gptMessage,
      },
    ]);

    for (const segment of response.segments) {
      const segmentMessage = `
__De ${ Math.round(segment.start) } a ${ Math.round(segment.end) } segundos:__
${segment.text}
      `;
      setMessages((prev) => [
        ...prev,
        {
          isGpt: true,
          text: segmentMessage,
        },
      ]);
    }
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
          <GptMessage text="Hola, ¿qué audio quieres generar hoy?" />

          {
            messages.map((message, index) => (
              message.isGpt
                ? (
                  <GptMessage key={index} text={message.text} />
                )
                : (
                  <MyMessage key={index} text={(message.text == '') ? 'Transcribe el audio' : message.text} />
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

      <TextMessageFile
        onSendMessage={onHandlePost}
        disableCorrections
        placeholder="Escribe tu mensaje..."
        accept="audio/*"
      />
    </div>
  )
}
