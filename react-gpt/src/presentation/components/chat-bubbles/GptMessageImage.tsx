interface Props {
  text?: string;
  imageUrl: string;
  alt: string;
  onImageSelected?: (imageUrl: string) => void;
}

export const GptMessageImage = ({ text, alt, imageUrl, onImageSelected }: Props) => {
  return (
    <div className="col-start-1 col-end-9 px-3 rounded-lg">
      <div className="flex flex-row items-start">
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-500 text-white font-bold flex-shrink-0">
          G
        </div>
        <div className="relative ml-3 text-sm bg-yellow-50 pt-3 pb-2 px-4 shadow rounded-xl w-full">
            <span>{text}</span>
            <img
              role={onImageSelected ? 'button' : 'img'}
              className="mt-2 rounded-xl w-96 h-96 object-cover"
              alt={alt}
              src={imageUrl}
              onClick={() => onImageSelected && onImageSelected(imageUrl)}
            />
        </div>
      </div>
    </div>
  )
}
