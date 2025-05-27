import { useEffect, useRef, useState } from 'react';
import { GptMessage, MyMessage, TypingLoader, TextMessageBoxSelect } from '../../components';
import { textToAudioUseCase } from '../../../core/use-cases';
import { GptMessageAudio } from '../../components/chat-bubbles';

const disclaimer = `## ¿Escribe el texto que deseas generar como audio?
  * Todo el audio generado es por AI
`;

const voices = [
  { id: 'nova', text: 'Nova' },
  { id: 'ash', text: 'Ash' },
  { id: 'coral', text: 'Coral' },
  { id: 'alloy', text: 'Alloy' },
  { id: 'echo', text: 'Echo' },
  { id: 'fable', text: 'Fable' },
  { id: 'onyx', text: 'Onyx' },
  { id: 'sage', text: 'Sage' },
  { id: 'shimmer', text: 'Shimmer' },
];

interface TextMessage {
  text: string;
  isGpt: boolean;
  type: 'text';
}

interface AudioMessage {
  text: string;
  isGpt: boolean;
  audio: string;
  type: 'audio';
}

type Message = TextMessage | AudioMessage;

export const TextToAudioPage = () => {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const onHandlePost = async (text: string, selectedVoice: string) => {
    setIsLoading(true);
    setMessages((prev) => [
      ...prev,
      {
        text,
        isGpt: false,
        type: 'text',
      },
    ]);

    const { message, status, audioUrl } = await textToAudioUseCase(text, selectedVoice);

    if (!status) {
      setMessages((prev) => [...prev, {
        text: message,
        isGpt: true,
        type: 'text',
      }]);

    } else {
      setMessages((prev) => [
        ...prev,
        {
          isGpt: true,
          audio: audioUrl!,
          text: `${selectedVoice} - "${message}"`,
          type: 'audio',
        },
      ]);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    // Auto-scroll to bottom on content update
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className='chat-container'>
      <div className='chat-messages'>
        <div className='grid grid-cols-2 gap-y-2'>
          {/* Welcome */}
          <GptMessage text={disclaimer} />

          {
            messages.map((message, index) => (
              message.isGpt ? (
                message.type === 'audio' ? (
                  <GptMessageAudio key={index} text={message.text} audio={message.audio} />
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
              <div className='col-start-1 col-end-12 fade-in'>
                <TypingLoader/>
              </div>
            )
          }
        </div>
      </div>

      <TextMessageBoxSelect
        options={voices.sort((a, b) => {
          if (a.id < b.id) return -1;
          if (a.id > b.id) return 1;
          return 0;
        })}
        onSendMessage={onHandlePost}
        disableCorrections
        placeholder='Escribe tu mensaje...'
      />
    </div>
  )
}

