import dbConnect from "@/utility/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import checkAccessKey from "@/middleware/checkAccessKey";

export async function POST(req) {
  await dbConnect();
  const body = await req.json();

  const { accessKey, password } = body;

  if (!accessKey || !password) {
    return new Response(JSON.stringify({
      success: false,
      message: "Access key and password required"
    }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ accessKey });
  if (existingUser) {
    return new Response(JSON.stringify({
      success: false,
      message: "Access key already exists"
    }), {
      status: 409,
      headers: { "Content-Type": "application/json" }
    });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const newUser = await User.create({
    accessKey,
    password: hashedPassword
  });

  return new Response(JSON.stringify({
    success: true,
    message: "User created successfully",
    user: {
      id: newUser._id,
      accessKey: newUser.accessKey
    }
  }), {
    status: 201,
    headers: { "Content-Type": "application/json" }
  });
}



export async function DELETE(req) {
  await dbConnect();
  const body = await req.json();

  const { accessKey, password } = body;

  if (!accessKey || !password) {
    return new Response(JSON.stringify({
      success: false,
      message: "Access key and password required"
    }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  // Find user
  const user = await User.findOne({ accessKey });
  if (!user) {
    return new Response(JSON.stringify({
      success: false,
      message: "User not found"
    }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
  }

  // Verify password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return new Response(JSON.stringify({
      success: false,
      message: "Invalid credentials"
    }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  // Delete user
  await User.findByIdAndDelete(user._id);

  return new Response(JSON.stringify({
    success: true,
    message: "User deleted successfully"
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}



// login user with password
export async function PUT(req) {
  await dbConnect();
  const body = await req.json();
  const { accessKey, password } = body;

  if (!accessKey || !password) {
    return new Response(JSON.stringify({
      success: false, message: "Access key and password required"
    }), { status: 400 });
  }

  const user = await User.findOne({ accessKey });
  if (!user) {
    return new Response(JSON.stringify({
      success: false, message: "User not found"
    }), { status: 404 });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return new Response(JSON.stringify({
      success: false, message: "Invalid credentials"
    }), { status: 401 });
  }

  // Create JWT token
  const JWT_SECRET = process.env.JWT_SECRET; 
  const token = jwt.sign(
    { userId: user._id, accessKey: user.accessKey },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return new Response(JSON.stringify({
    success: true,
    message: "Login successful",
    token
  }), { status: 200 });
}


// login with access key
export async function GET(req) {
  await dbConnect();
 
  const access = await checkAccessKey(req);
  if (!access.success) return access;  


  return new Response(JSON.stringify({
    success: true, accessKey: access.user.accessKey
  }), { status: 200 });
}
