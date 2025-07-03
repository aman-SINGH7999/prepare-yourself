import jwt from "jsonwebtoken";


export default async function checkUserAuth(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      success: false,
      response: new Response(JSON.stringify({
        success: false,
        message: "Authorization token missing"
      }), { status: 401 })
    };
  }

  const token = authHeader.split(" ")[1];
  console.log("token: ",token)
  const JWT_SECRET = process.env.JWT_SECRET;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("decoded: ", decoded)
    return { success: true, user: decoded };
  } catch (err) {
    return {
      success: false,
      response: new Response(JSON.stringify({
        success: false,
        message: "Invalid or expired token"
      }), { status: 401 })
    };
  }
}
