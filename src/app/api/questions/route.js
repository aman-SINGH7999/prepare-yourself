import dbConnect from "@/utility/dbConnect";
import Question from "@/models/Question";
import checkAccessKey from "@/middleware/checkAccessKey";

export async function GET(req) {
  await dbConnect();

  const access = await checkAccessKey(req);
  if (!access.success) return access;  


  const questions = await Question.find({ user:access.user._id }).lean();


  return new Response(JSON.stringify({ success: true, questions }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}
