export default function LetterHider({
  answer,
  userInput,
}: {
  answer: string;
  userInput: string;
}) {
  return (
    <div className='pt-6 pb-9 max-w-full flex justify-center'>
      {answer &&
        answer
          .toLowerCase()
          .split('')
          .map((letter, index) => (
            <span
              key={index}
              className={`mr-1 mb-1 lg:mb-2 p-1 h-6 w-6 transition-opacity duration-1000 ease-in-out transform max-w-full flex items-center justify-center uppercase shadow-sm text-sm font-semibold ${
                letter === userInput.toLowerCase().split('')[index]
                  ? ''
                  : 'bg-black text-black'
              }`}
            >
              {/* Don't render the letter so the answer can't be inspected in devtools */}
              {letter === userInput.toLowerCase().split('')[index]
                ? letter
                : ''}
            </span>
          ))}
    </div>
  );
}
