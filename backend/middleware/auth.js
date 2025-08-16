// middleware/auth.js
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  console.log("verifyToken chạy!");

  // Lấy token từ header hoặc cookie
  const token =
    req.headers["authorization"]?.split(" ")[1] || req.cookies?.token;

  console.log("Token nhận được:", token);

  if (!token) {
    return res
      .status(401)
      .json({ message: "Bạn chưa đăng nhập hoặc token không tồn tại" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next(); // Cho phép tiếp tục nếu token hợp lệ
  } catch (err) {
    // Xác định lỗi cụ thể
    if (err.name === "TokenExpiredError") {
      return res
        .status(403)
        .json({
          message: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại",
        });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(403).json({ message: "Token không hợp lệ" });
    }
    return res.status(403).json({ message: "Xác thực thất bại" });
  }
};
