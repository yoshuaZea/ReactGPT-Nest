import Markdown from 'react-markdown';

interface Props {
  text: string;
}

export const GptMessage = ({ text }: Props) => {
  return (
    <div className="col-start-1 col-end-9 px-3 rounded-lg">
      <div className="flex flex-row items-start">
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-500 text-white font-bold flex-shrink-0">
          G
        </div>
        <div className="relative ml-3 text-sm bg-yellow-50 pt-3 pb-2 px-4 shadow rounded-xl w-full">
          <Markdown>{text}</Markdown>
        </div>
      </div>
    </div>
  )
}
