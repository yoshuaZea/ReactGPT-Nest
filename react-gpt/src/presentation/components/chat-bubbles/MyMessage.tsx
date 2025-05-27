interface Props {
  text: string;
}

export const MyMessage = ({ text }: Props) => {
  return (
    <div className="col-start-6 col-end-13 px-3 rounded-lg">
      <div className="flex items-center justify-start flex-row-reverse">
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-lime-500 text-white font-bold flex-shrink-0">
          F
        </div>
        <div className="relative mr-3 text-sm bg-lime-200 py-2 px-4 shadow rounded-xl">
          <div>{ text }</div>
        </div>
      </div>
    </div>
  );
};