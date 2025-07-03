import dbConnect from "@/utility/dbConnect";
import User from "@/models/User";

export default async function checkAccessKey(req) {
  await dbConnect();

  const accessKey = req.headers.get("accessKey"); 

  if (!accessKey) {
    return new Response(JSON.stringify({
      success: false,
      message: "Access key required"
    }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  // Find user by accessKey
  const user = await User.findOne({ accessKey }).select("_id accessKey");
  if (!user) {
    return new Response(JSON.stringify({
      success: false,
      message: "User not found"
    }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
  }

  return {
    success: true,
    user: {
      _id: user._id,
      accessKey: user.accessKey
    }
  };
}
