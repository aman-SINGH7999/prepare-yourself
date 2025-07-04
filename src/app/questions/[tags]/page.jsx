'use client'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { FaRegPenToSquare } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import Modal from '@/components/Modal';
import { redirect } from 'next/navigation'
import { logout } from '@/store/slices/userSlice';
import AddQuestion from '@/components/AddQuestion';
import { toast } from 'react-toastify';
import ThemeToggle from '@/components/ThemeToggle';

export default function Page() {
  const [difficulty, setDifficulty] = useState("all");
  const [openQuestionId, setOpenQuestionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [updateQuestion, setUpdateQuestion] = useState(false);
  const [deleteQuestion, setDeleteQuestion] = useState(false);
  const [tag, setTag] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [answer, setAnswer] = useState("");
  const [difficultyText, setDifficultyText] = useState("easy");

  const { accessKey, token } = useSelector((state) => state.user);
  const { selectedTag } = useSelector((state) => state.utility);
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!accessKey) redirect('/login')
  }, [accessKey])

  const getAllQuestions = async () => {
    try {
      const { data } = await axios.post(`/api/questions/tag/${selectedTag}`, {}, {
        headers: { accessKey }
      });
      console.log("All questions", data);
      setQuestions(data.questions);
    } catch (error) {
      console.log("Error in Getting all Questions.", error);
    }
  }

  useEffect(() => {
    getAllQuestions();
  }, [selectedTag])

  const handleUpdateQuestions = async (e) => {
    e.preventDefault();
    if (!tag || !questionText || !answer) {
      alert("Fill all fields");
      return;
    }
    try {
      const { data } = await axios.put(`/api/questions/${updateQuestion}`, {
        tag, question: questionText, answer, difficulty: difficultyText
      }, {
        headers: { accessKey, authorization: `Bearer ${token}` }
      });
      console.log("Updated:", data);
      getAllQuestions();
      setUpdateQuestion(false);
      setTag(""); setQuestionText(""); setAnswer(""); setDifficultyText("easy");
      toast.success(data?.message || "Question Updated successfully.");
    } catch (error) {
      console.error("Update failed", error);
      toast.error(error?.response?.data?.message || "Failed to update question.");
    }
  }

  const handleDeleteQuestion = async (id) => {
    try {
      const { data } = await axios.delete(`/api/questions/${id}`, {
        headers: { accessKey, authorization: `Bearer ${token}` }
      });
      console.log("Deleted:", data);
      getAllQuestions();
      setDeleteQuestion(false);
      toast.success(data?.message || "Question Deleted successfully.");
    } catch (error) {
      console.error("Failed to delete question", error);
      toast.error(error?.response?.data?.message || "Failed to delete question.");
    }
  }

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} min-h-screen`}>
      
      {/* navbar */}
      <div className={`flex justify-between items-center border-b 
        ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}>
        <div className="flex gap-4 mb-2">
          {["easy", "medium", "hard", "all"].map(level => (
            <button
              key={level}
              onClick={() => setDifficulty(level)}
              className={`px-4 py-2 border cursor-pointer 
                ${theme === 'dark' ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-400 hover:bg-gray-200'} 
                ${difficulty === level ? (theme === 'dark' ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white') : ''}`}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
        <div className='flex gap-2'>
          <ThemeToggle />
          {token && <AddQuestion getAllQuestions={getAllQuestions} />}
          <button
            onClick={() => dispatch(logout())}
            className='px-4 py-2 mb-2 bg-red-600 text-white cursor-pointer'
          >
            Logout
          </button>
        </div>
      </div>

      {/* main container */}
      <div className="mt-5 w-full max-w-4xl mx-auto flex flex-col gap-2">
        {
          questions.length > 0 ? questions
            .filter(q => q.difficulty === difficulty || difficulty === "all")
            .map((question) => {
              const isOpen = openQuestionId === question._id;
              return (
                <div
                  key={question._id}
                  className={`shadow-sm p-6 cursor-pointer transition duration-300 hover:shadow-lg
                    ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
                  onClick={() => setOpenQuestionId(isOpen ? null : question._id)}
                >
                  <div className="flex justify-between items-center">
                    <div className="text-lg font-semibold border-b border-gray-600">
                      {question.question}
                    </div>
                    {token && (
                      <div className="flex gap-2 ml-2">
                        <FaRegPenToSquare 
                          onClick={async (e) => {
                            e.stopPropagation();
                            try {
                              const { data } = await axios.get(`/api/questions/${question._id}`, {
                                headers: { accessKey, authorization: `Bearer ${token}` }
                              });
                              if (data.success) {
                                setTag(data.question.tag);
                                setQuestionText(data.question.question);
                                setAnswer(data.question.answer);
                                setDifficultyText(data.question.difficulty || "easy");
                                setOpenQuestionId(null);
                                setUpdateQuestion(question._id);
                              }
                            } catch (err) {
                              console.error("Failed to load question", err);
                              alert("Failed to load question for editing");
                            }
                          }}
                        />
                        <RiDeleteBin5Line onClick={() => setDeleteQuestion(question._id)} />
                      </div>
                    )}
                  </div>
                  {isOpen && (
                    <div className="mt-4">
                      {question.answer}
                    </div>
                  )}
                </div>
              )
            })
          :
            <div className='flex mt-20 flex-col items-center justify-center h-full text-center px-4'>
              <h1 className='text-2xl md:text-4xl font-bold mb-4 drop-shadow-lg'>
                For getting Started
              </h1>
              <p className={`max-w-xl text-lg md:text-xl mb-8 
                ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Please select the Topic which you want to read.
              </p>
            </div>
        }
      </div>

      {updateQuestion && (
        <Modal onClose={() => {
          setUpdateQuestion(false);
          setTag(""); setQuestionText(""); setAnswer(""); setDifficultyText("easy");
        }}>
          <h2 className="text-xl font-bold mb-4">Update Question</h2>
          <form onSubmit={handleUpdateQuestions}>
            <input type="text" value={tag} onChange={(e) => setTag(e.target.value)} placeholder="Question-Tag"
              className="border p-2 w-full mb-2" />
            <textarea value={questionText} onChange={(e) => setQuestionText(e.target.value)} rows={2}
              placeholder="Question" className="border p-2 w-full mb-2"></textarea>
            <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={4}
              placeholder="Answer" className="border p-2 w-full mb-2"></textarea>
            <div className='flex justify-between items-center'>
              <select className='bg-[#fff4] px-4 py-2 cursor-pointer' value={difficultyText} 
                onChange={(e) => setDifficultyText(e.target.value)}>
                <option style={{ color: "black" }} value="easy">Easy</option>
                <option style={{ color: "black" }} value="medium">Medium</option>
                <option style={{ color: "black" }} value="hard">Hard</option>
              </select>
              <button type='submit' className="bg-yellow-600 cursor-pointer text-white px-4 py-2">Update</button>
            </div>
          </form>
        </Modal>
      )}

      {deleteQuestion && (
        <Modal onClose={() => setDeleteQuestion(false)}>
          <h2 className="text-xl font-bold mb-4">Are you sure to Delete this Question?</h2>
          <div className="flex gap-4">
            <button onClick={() => handleDeleteQuestion(deleteQuestion)}
              className='bg-red-600 cursor-pointer text-white px-4 py-2'>
              Yes, Delete
            </button>
            <button onClick={() => setDeleteQuestion(false)}
              className='border cursor-pointer px-4 py-2'>
              Cancel
            </button>
          </div>
        </Modal>
      )}

    </div>
  )
}
