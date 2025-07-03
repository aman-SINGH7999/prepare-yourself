import checkAccessKey from "@/middleware/checkAccessKey";
import Question from "@/models/Question";
import dbConnect from "@/utility/dbConnect";


// get all questions-------------------------------------------------------------------------------
export async function POST(req, context){
  await dbConnect();
  const { tag } = context.params;

  const access = await checkAccessKey(req);
  if (!access.success) return access;

 
  const questions = await Question.find({ user: access.user._id, tag }).lean();

  if (!questions.length) {
    return new Response(JSON.stringify({
      success: false,
      message: "No tags found"
    }), { status: 404 });
  }


  return new Response(JSON.stringify({
    success: true,
    questions
  }), { status: 200 });
}