import { useState } from 'react';
import { GptMessage, MyMessage, TypingLoader, TextMessageBoxSelect } from '../../components';
import { translateUseCase } from '../../../core/use-cases';


interface Message {
  text: string;
  isGpt: boolean;
}

const languages = [
  { id: "alemán", text: "Alemán" },
  { id: "árabe", text: "Árabe" },
  { id: "bengalí", text: "Bengalí" },
  { id: "francés", text: "Francés" },
  { id: "hindi", text: "Hindi" },
  { id: "inglés", text: "Inglés" },
  { id: "japonés", text: "Japonés" },
  { id: "mandarín", text: "Mandarín" },
  { id: "portugués", text: "Portugués" },
  { id: "ruso", text: "Ruso" },
];

export const TranslatePage = () => {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const onHandlePost = async (text: string, selectedOption: string) => {
    setIsLoading(true);

    const newMessage = `Traduce el texto "${text}" al idioma "${selectedOption}"`;

    setMessages((prev) => [
      ...prev,
      {
        text: newMessage,
        isGpt: false,
      },
    ]);

    const { lang, message, originalText, status } = await translateUseCase(text, selectedOption);

    if (!status) {
      setMessages((prev) => [...prev, {
        text: 'No se pudo realizar la traducción',
        isGpt: true,
      }]);

    } else {
      setMessages((prev) => [
        ...prev,
        {
          text: `"${originalText}" al idioma ${lang} se traduce de la siguiente forma:\n"${message}"`,
          isGpt: true,
        },
      ]);
    }
    
    setIsLoading(false);
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-2 gap-y-2">
          {/* Welcome */}
          <GptMessage text="Hola, ¿qué quieres traducir hoy?" />

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
                <TypingLoader/>
              </div>
            )
          }
        </div>
      </div>

      <TextMessageBoxSelect
        options={languages}
        onSendMessage={onHandlePost}
        placeholder="Escribe tu mensaje..."
      />
    </div>
  )
}
