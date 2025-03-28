import { useEffect, useState } from 'react';
import TObject from '../utils/question';

interface PreviewPageProps {
  questions: TObject[];
  file: string | null;
}

const PreviewPage: React.FC<PreviewPageProps> = ({ questions, file }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<TObject | null>(null);
  const [userInput, setUserInput] = useState<{ [key: string]: string | string[] }>({});

  useEffect(() => {
    setCurrentQuestion(questions[currentQuestionIndex]);
  }, [currentQuestionIndex, questions]);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };


  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;

    setUserInput((prevInput) => {
      if (type === "checkbox") {
        const currentSelections = prevInput[name] ? [...(prevInput[name] as string[])] : [];
        if (checked) {
          return { ...prevInput, [name]: [...currentSelections, value] };
        } else {
          return { ...prevInput, [name]: currentSelections.filter((item) => item !== value) };
        }
      } else {
        return { ...prevInput, [name]: value };
      }
    });
  };

  useEffect(() => {
    console.log("File in PreviewPage:", file);
  }, [file]);


  return (
    <div className="bg-[#fff0d9] h-[100vh] flex flex-col items-center justify-center">
      {currentQuestion && (
        <div className="bg-white rounded shadow-lg p-6 min-w-[400px] w-[auto] h-auto">
          <p>{currentQuestion.questionDescription} <span className='text-[red]'>
            {currentQuestion.isRequired == true && '*'}</span></p>
          {currentQuestion.type === "file" && file && (
            <img src={file} alt="Uploaded Image" className="mb-4 border w-full max-w-xs" />
          )}
          {
            currentQuestion.type === 'text' && <input
              type="text"
              value={userInput[currentQuestion.questionName] || ''}
              onChange={handleInputChange}
              name={currentQuestion.questionName}
              className="block w-[60%] bg-white pt-10 pb-2 text-sm text-gray-700 outline-none border-b-[1px]"
              placeholder='Your answer'
            />
          }
          {
            currentQuestion.type === 'multiple' &&
            <div className='pt-5 pb-2 flex flex-col gap-2'>
              {currentQuestion.options?.map((option, index) => {
                const inputId = `${currentQuestion.questionName}-${index}`;
                return (
                  <div className='flex gap-5' key={index}>
                    <input
                      type="radio"
                      id={inputId}
                      name={currentQuestion.questionName}
                      value={option}
                      checked={userInput[currentQuestion.questionName] === option}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <label htmlFor={inputId}>{option}</label>
                  </div>
                );
              })}
            </div>
          }

          {/* {
            currentQuestion.type === 'multiple' &&
            <div className='pt-5 pb-2 flex flex-col gap-2'>
              {currentQuestion.options?.map((option, index) => (
                <div className='flex gap-5' key={index}>
                  <input
                    type="radio"
                    name={currentQuestion.questionName}
                    value={option}
                    checked={userInput[currentQuestion.questionName] === option}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span>{option}</span>
                </div>
              ))}
            </div>
          } */}
          {/* {
            currentQuestion.type === 'checkboxes' &&
            <div className='pt-5 pb-2 flex flex-col gap-2'>
              {currentQuestion.options?.map((option, index) => (
                <div className='flex gap-5' key={index}>
                  <input
                    type="checkbox"
                    name={currentQuestion.questionName}
                    value={option}
                    checked={userInput[currentQuestion.questionName]?.includes(option) || false}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span>{option}</span>
                </div>
              ))}
            </div>
          } */}
          {
            currentQuestion.type === 'checkboxes' &&
            <div className='pt-5 pb-2 flex flex-col gap-2'>
              {currentQuestion.options?.map((option, index) => (
                <label key={index} className="flex gap-5">
                  <input
                    type="checkbox"
                    name={currentQuestion.questionName}
                    value={option}
                    checked={userInput[currentQuestion.questionName]?.includes(option) || false}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>
          }

          {/* {
            currentQuestion.type === 'linear' && currentQuestion.linearScale && (
              <div className='pt-5 pb-2 flex justify-center gap-10'>
                {[...Array(currentQuestion.linearScale.max!.value - currentQuestion.linearScale.min!.value + 1)].map((_, i) => (
                  <div className='flex gap-3 flex-col' key={i}>
                    <span>{i + currentQuestion.linearScale!.min!.value}</span>
                    <input
                      type="radio"
                      name={currentQuestion.questionName}
                      value={i + currentQuestion.linearScale!.min!.value}
                      checked={userInput[currentQuestion.questionName] === (i + currentQuestion.linearScale!.min!.value).toString()}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                  </div>
                ))}
              </div>
            )
          } */}
          {
            currentQuestion.type === 'linear' && currentQuestion.linearScale && (
              <div className='pt-5 pb-2 flex justify-center gap-10'>
                {[...Array(currentQuestion.linearScale.max!.value - currentQuestion.linearScale.min!.value + 1)].map((_, i) => {
                  const scaleValue = i + currentQuestion.linearScale!.min!.value;
                  const inputId = `${currentQuestion.questionName}-${scaleValue}`;

                  return (
                    <div className='flex gap-3 flex-col' key={i}>
                      <label htmlFor={inputId}>{scaleValue}</label>
                      <input
                        type="radio"
                        id={inputId}
                        name={currentQuestion.questionName}
                        value={scaleValue}
                        checked={userInput[currentQuestion.questionName] === scaleValue.toString()}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                    </div>
                  );
                })}
              </div>
            )
          }

          <div className="mt-4 flex justify-between items-center">
            <button className={`px-4 py-2  rounded ${currentQuestionIndex === 0 ? 'bg-gray-300 text-gray-600' : 'bg-[#ff9800] text-white'}`}
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}>
              Previous
            </button>
            <span>{currentQuestionIndex + 1} of {questions.length}</span>
            <button className={`px-4 py-2  rounded ${currentQuestionIndex === questions.length - 1 ? 'bg-gray-300 text-gray-600' : 'bg-[#ff9800] text-white'}`}
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === questions.length - 1}>
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewPage;
