import { useEffect, useRef, useState } from 'react';
import { GptMessage, MyMessage, TypingLoader, TextMessageBox } from '../../components';
import { imageGenerationUseCase, imageVariationUseCase } from '../../../core/use-cases';
import { GptMessageImage, GptMessageSelectableImage } from '../../components/chat-bubbles';

interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    imageUrl: string,
    alt: string,
  }
}

export const ImageTunningPage = () => {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([{
    isGpt: true,
    text: 'Imagen base',
    info: {
      alt: 'Imagen base',
      imageUrl: 'http://localhost:3000/api/gpt/image-generation/1747942396549.png',
    }
  }]);
  const [originalImageAndMask, setOriginalImageAndMask] = useState({
    original: undefined as string | undefined,
    mask: undefined as string | undefined,
  });
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

    const { mask, original } = originalImageAndMask;

    const imageInfo = await imageGenerationUseCase(text, original, mask);
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

    const hanldeVariation = async () => {
    setIsLoading(true);

    const res = await imageVariationUseCase(originalImageAndMask.original!);

    if (!res) return;

    setMessages((prev) => [
      ...prev,
      {
        text: 'Variación',
        isGpt: true,
        info: {
          imageUrl: res.url,
          alt: res.alt,
        }
      }
    ]);

    setIsLoading(false);
  }

  useEffect(() => {
    // Auto-scroll to bottom on content update
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      {
        originalImageAndMask.original && (
          <div className="fixed flex flex-col items-center top-10 right-10 z-10 fade-in">
            <span>Editando</span>
            <img 
              className="border rounded-xl w-36 h-36 object-contain"
              src={originalImageAndMask.mask ?? originalImageAndMask.original}
              alt="Original image"
            />
            <button
              className="btn-primary"
              onClick={hanldeVariation}
            >Generar variación</button>
          </div>
        )
      }
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
                      // <GptMessageImage
                      //   key={index}
                      //   text={message.text}
                      //   {...message.info}
                      //   onImageSelected={(url) => setOriginalImageAndMask({ mask: undefined, original: url })}
                      // />
                      <GptMessageSelectableImage
                        key={index}
                        text={message.text}
                        {...message.info}
                        onImageSelected={(maskImagUrl) => setOriginalImageAndMask({ mask: maskImagUrl, original: message.info?.imageUrl })}
                      />
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
    </>
  )
}
