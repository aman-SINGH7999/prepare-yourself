import dbConnect from "@/utility/dbConnect";
import Question from "@/models/Question";
import checkUserAuth from "@/middleware/checkUserAuth";
import checkAccessKey from "@/middleware/checkAccessKey";

// add question--------------------------------------------------------------------------------------------------
export async function POST(req) {
  await dbConnect();

  // Authenticate user using middleware
  const auth = await checkUserAuth(req);
  if (!auth.success) return auth;  // agar fail hua to wahi response return ho jayega

  const user = auth.user;

  // Parse remaining body fields
  const body = await req.json();

  if (!body.tag || !body.question || !body.answer) {
    return new Response(JSON.stringify({
      success: false,
      message: "Tag, question and answer are required."
    }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  // Create question linked to user
  const newQuestion = await Question.create({
    user: user.userId,
    tag: body.tag,
    question: body.question,
    answer: body.answer,
    difficulty: body.difficulty || "easy"
  });

  return new Response(JSON.stringify({
    success: true,
    question: newQuestion
  }), {
    status: 201,
    headers: { "Content-Type": "application/json" }
  });
}


 // get all tags-----------------------------------------------------------------------------------------------------
export async function GET(req) {
  await dbConnect();

  const access = await checkAccessKey(req);
  if (!access.success) return access;

 
  const tags = await Question.find({ user: access.user._id }).select("tag").lean();

  if (!tags.length) {
    return new Response(JSON.stringify({
      success: false,
      message: "No tags found"
    }), { status: 404 });
  }

  // extract tags and make them unique
  const uniqueTags = [...new Set(
  tags
    .map(q => q.tag)
    .filter(tag => typeof tag === "string" && tag.trim() !== "")
)];

  return new Response(JSON.stringify({
    success: true,
    tags: uniqueTags
  }), { status: 200 });
}
