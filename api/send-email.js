import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();
const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors({
    origin: ["https://ootacuisine.com"], // الدومين بتاعك
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
  }));
  
app.use(bodyParser.json());

app.post("/send-email", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const data = await resend.emails.send({
    from: 'Oota <onboarding@resend.dev>', // لازم يكون دومين موثق في Resend
    to: 'romasameh580@gmail.com', // إيميل صاحب الموقع
      subject: `رسالة جديدة من ${name}`,
      html: `
        <p><strong>الاسم:</strong> ${name}</p>
        <p><strong>البريد:</strong> ${email}</p>
        <p><strong>الرسالة:</strong></p>
        <p>${message}</p>
      `,
    });

    console.log("تم إرسال الإيميل:", data);
    res.status(200).json({ success: true, message: "تم إرسال الإيميل بنجاح" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "حصل خطأ أثناء الإرسال" });
  }
});

export default app;
