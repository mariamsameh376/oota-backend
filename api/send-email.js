import { Resend } from "resend";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "الرجاء إدخال جميع الحقول" });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "your-verified-domain@yourdomain.com", // لازم يكون دومين موثق في Resend
      to: "your-email@example.com", // إيميلك اللي هيوصله الرسالة
      subject: `رسالة جديدة من ${name}`,
      html: `
        <p><strong>الاسم:</strong> ${name}</p>
        <p><strong>البريد:</strong> ${email}</p>
        <p><strong>الرسالة:</strong></p>
        <p>${message}</p>
      `,
    });

    return res.status(200).json({ success: true, message: "تم إرسال الإيميل بنجاح" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ success: false, message: "حصل خطأ أثناء الإرسال" });
  }
}
