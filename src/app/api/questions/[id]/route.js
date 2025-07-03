import dbConnect from "@/utility/dbConnect";
import Question from "@/models/Question";
import { Types } from "mongoose";
import checkAccessKey from "@/middleware/checkAccessKey";
import checkUserAuth from "@/middleware/checkUserAuth";


// get single question------------------------------------------------------------------------------------------
export async function GET(req, context) {
  await dbConnect();
  const { id } = context.params;
 
  const access = await checkAccessKey(req);
  if (!access.success) return access;  


  if (!Types.ObjectId.isValid(id)) {
    return new Response(JSON.stringify({
      success: false, message: "Invalid ID"
    }), { status: 400 });
  }

  const question = await Question.findOne({ _id: id,  user: access.user._id }).lean();

  if (!question) {
    return new Response(JSON.stringify({
      success: false, message: "Question not found or access denied"
    }), { status: 404 });
  }

  return new Response(JSON.stringify({
    success: true, question
  }), { status: 200 });
}



// update question------------------------------------------------------------------------------------------------------
export async function PUT(req, context) {
  await dbConnect();
  const { id } = context.params;
  const body = await req.json();

  // Authenticate user using middleware
  const auth = await checkUserAuth(req);
  if (!auth.success) return auth.response;

  const user = auth.user;

  if (!Types.ObjectId.isValid(id)) {
    return new Response(JSON.stringify({
      success: false, message: "Invalid ID"
    }), { status: 400 });
  }

  const question = await Question.findOne({ _id: id,  user: user.userId });

  if (!question) {
    return new Response(JSON.stringify({
      success: false, message: "Question not found"
    }), { status: 404 });
  }


  const updateData = {
    question: body.question,
    answer: body.answer,
    tag: body.tag,
    difficulty: body.difficulty
  };

  const updatedQuestion = await Question.findByIdAndUpdate(id, updateData, { new: true }).lean();

  
  return new Response(JSON.stringify({
    success: true, question: updatedQuestion
  }), { status: 200 });
}


// delete question ------------------------------------------------------------------------------------------------------
export async function DELETE(req, context) {
  await dbConnect();
  const { id } = context.params;
  
  // Authenticate user using middleware
  const auth = await checkUserAuth(req);
  if (!auth.success) return auth.response;

  const user = auth.user;


  if (!Types.ObjectId.isValid(id)) {
    return new Response(JSON.stringify({
      success: false, message: "Invalid ID"
    }), { status: 400 });
  }

  const deletedQuestion = await Question.findOneAndDelete({ _id: id, user: user.userId });

  if (!deletedQuestion) {
    return new Response(JSON.stringify({
      success: false, message: "Question not found."
    }), { status: 404 });
  }

  return new Response(JSON.stringify({
    success: true, message: "Question deleted successfully"
  }), { status: 200 });
}
