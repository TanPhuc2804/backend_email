require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

// Middleware
const corsOptions = {
    origin: 'https://4anni-final-h.vercel.app', // Thay bằng domain frontend của bạn (Lưu ý: Không có dấu gạch chéo / ở cuối)
    methods: ['POST', 'GET', 'OPTIONS'],      // Các phương thức được phép
    allowedHeaders: ['Content-Type']
};

app.use(cors(corsOptions));
app.use(express.json());

// Cấu hình Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // Bạn có thể đổi sang yahoo, outlook... nếu cần
    auth: {
        user: "phantanphuc282004@gmail.com",
        pass: "nfhx jpqd jzcs zyuj"
    }
});

// API endpoint để gửi email
app.post('/api/send-email', async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Vui lòng nhập nội dung trước khi gửi!' });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // TỰ ĐỘNG GỬI VỀ CHÍNH EMAIL CỦA BẠN
        subject: 'Có tin nhắn mới từ người dùng trên Website',
        text: `Bạn vừa nhận được một tin nhắn với nội dung như sau:\n\n${text}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Đã gửi thông tin cho quản trị viên thành công!' });
    } catch (error) {
        console.error('Lỗi khi gửi email:', error);
        res.status(500).json({ error: 'Lỗi server, không thể gửi tin nhắn lúc này.' });
    }
});


app.get('/', (req, res) => {
    res.send('Server đang chạy. Sử dụng endpoint /api/send-email để gửi email.');
});

// Khởi chạy server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
