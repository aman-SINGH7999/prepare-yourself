'use client'
import axios from 'axios';
import React, { useState } from 'react'
import Modal from '@/components/Modal';
import { useSelector , useDispatch} from 'react-redux';
import { toast } from 'react-toastify';
import { setSelectedTag } from '@/store/slices/utilitySlice';



export default function AddQuestion({getAllQuestions = () => {}}) {
    const [addQuestion, setAddQuestion] = useState(false)
    const [tag, setTag] = useState("");
    const [questionText, setQuestionText] = useState("");
    const [answer, setAnswer] = useState("");
    const [difficultyText, setDifficultyText] = useState("easy");

    const {accessKey, token } = useSelector((state)=>state.user);
    const dispatch = useDispatch();


    const handleAddQuestion = async (e) => {
      e.preventDefault();
      if (!tag || !questionText || !answer) {
        toast.warning("Please fill all fields");
        return;
      }

      try {
        const { data } = await axios.post("/api/questions/add", {
          tag,
          question: questionText,
          answer,
          difficulty: difficultyText
        }, {
          headers: { accessKey, authorization: `Bearer ${token}` }
        });

        console.log("Question added:", data);
        dispatch(setSelectedTag(tag));
        getAllQuestions();
        setAddQuestion(false);
        setTag(""); setQuestionText(""); setAnswer(""); // clear form
        toast.success(error?.response?.data?.message || "Question added successfully.");
      } catch (error) {
        // toast.error(error?.response?.data?.message || "Failed to add question")
        console.error("Failed to add question", error);
      }
    };


  return (
    <>
    <button
        onClick={() => setAddQuestion(true)}
        className={`px-4 py-2 mb-2 border cursor-pointer bg-green-600 text-white`}
    >
        Add Question
    </button>
    {addQuestion && (
        <Modal onClose={() => setAddQuestion(false)}>
            <h2 className="text-xl font-bold mb-4">Add Question</h2>
            <form onSubmit={handleAddQuestion}>
            <input type="text" value={tag} onChange={(e)=> setTag(e.target.value)} placeholder="Question-Tag" className="border p-2 w-full mb-2"/>
            <textarea type="text" value={questionText} onChange={(e)=> setQuestionText(e.target.value)} rows={2} placeholder="Question" className="border p-2 w-full mb-2"></textarea>
            <textarea type="text"value={answer} onChange={(e)=> setAnswer(e.target.value)} rows={4} placeholder="Answer" className="border p-2 w-full mb-2"></textarea>
            <div className='flex justify-between items-center'>
                <select name="" id="" className='bg-[#fff4] px-4 py-2 cursor-pointer' value={difficultyText} onChange={(e)=> setDifficultyText(e.target.value)}>
                <option style={{color:"black"}} value="easy">Easy</option>
                <option style={{color:"black"}} value="medium">Medium</option>
                <option style={{color:"black"}} value="hard">Hard</option>
                </select>
                <button type='submit' className="bg-green-600 cursor-pointer text-white px-6 py-2">Add</button>
            </div>
            </form>
        </Modal>
    )}
    </>
  )
}
