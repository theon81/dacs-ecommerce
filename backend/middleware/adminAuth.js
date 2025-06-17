import jwt from 'jsonwebtoken';

const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.headers;
        if (!token) {
            return res.json({ success: false, message: "Not Authorized Login Again" });
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        // Thêm log để kiểm tra
        console.log('Token decode:', token_decode);
        console.log('ENV EMAIL:', process.env.ADMIN_EMAIL);
        console.log('ENV PASSWORD:', process.env.ADMIN_PASSWORD);

        if (
            String(token_decode.email).trim() !== String(process.env.ADMIN_EMAIL).trim() ||
            String(token_decode.password).trim() !== String(process.env.ADMIN_PASSWORD).trim()
        ) {
            return res.json({ success: false, message: "Not Authorized Login Again" });
        }

        next();
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export default adminAuth;