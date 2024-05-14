import './index.css'
import QuestionComponent from './components/question.component';
import { Route, Routes, Link, useLocation } from 'react-router-dom';
import TObject from './utils/question';
import { PiEye } from "react-icons/pi";
import useStore from './utils/store';
import PreviewPage from './components/preview';
import { IoMdAdd } from "react-icons/io";
import { IoCheckmark } from "react-icons/io5";
import { useState } from 'react';

const App = () => {
  const location = useLocation();
  const isPreviewPage = location.pathname === '/preview';
  const questions = useStore((state) => state.questions);
  const addQuestion = useStore((state) => state.addQuestion);
  const deleteQuestion = useStore((state) => state.deleteQuestion);
  const updateQuestion = useStore((state) => state.updateQuestion);
  const [file, setFile] = useState<File | null>(null);


  const handleAddQuestion = () => {
    addQuestion({ questionName: '', questionDescription: '', isRequired: false, type: 'text' });
  };

  const handleDeleteQuestion = (index: number) => {
    deleteQuestion(index);
  };

  const handleUpdateQuestion = (index: number, question: TObject) => {
    updateQuestion(index, question);
  };

  console.log(file, "fie")
  const handlePreviewQuestions = () => {
    // window.open('/preview', '_blank'); // Open preview page in a new tab
  };

  return (
    <div className='h-[100%] bg-[#fff0d9] '>
      {
        !isPreviewPage && <div className='flex justify-end px-10 py-5'>
          <div className=" flex flex-col items-center">
            <Link to="/preview">
              <PiEye className="eye-icon" size={30} />
            </Link>
            <span className="font-semibold">Preview</span>
          </div>
        </div>
      }

      <div className='min-h-[100vh] w-[100%] flex justify-between '>
        <div className={`flex h-[100%] flex-col  ${!isPreviewPage ? "w-[35%]" : ""} `}>
          {!isPreviewPage && (
            <>
              <div className='bg-white rounded flex flex-col shadow-md p-6 m-9 min-h-[200px] h-[auto]'>
                <span className='text-[18px] font-bold mb-[1em]'>Questions</span>
                <div>
                  {
                    questions.map((q, index) => (
                      <>
                        {q.questionDescription !== '' && <div className='text-[#6e6e6e] flex items-center gap-2 font-medium mt-[0.4em] mx-3'>
                          <div className='border rounded-full p-2'>
                            <IoCheckmark size={20} />
                          </div>
                          <div>
                            {index + 1} {q.questionDescription?.slice(0, 10)}{q.questionDescription?.length > 10 ? ".." : ""}
                          </div>
                        </div>}
                      </>
                    ))
                  }
                </div>
              </div>
              <button onClick={handleAddQuestion} className="mx-[2em] text-white font-semibold py-2 px-4 rounded-md flex items-center gap-5 bg-[#ff9800]"><IoMdAdd size={20} /> Add Question</button>
            </>
          )}
        </div>
        <div className={`${!isPreviewPage ? "w-[65%]" : "w-[100%]"}`}>
          <Routes>
            <Route path='/' element={questions.map((question, index) => (
              <div className='' key={index}>
                <QuestionComponent
                  question={question}
                  file={file}
                  setFile={setFile}
                  onDelete={() => handleDeleteQuestion(index)}
                  onUpdate={(question) => handleUpdateQuestion(index, question)}
                />
              </div>
            ))}>
            </Route>
            <Route path='/preview' element={<PreviewPage questions={questions} file={file}/>} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;