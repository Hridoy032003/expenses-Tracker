// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "husarkar@enacton.com", // Your Gmail address
//     pass: "guipixasbeocakbo", // Your 16-digit App Password
//   },
// });

// export async function sendMail(userEmail: string, text: string) {
//   try {
//     await transporter.sendMail({
//       from: `"Expence Tracker" <husarkar@enacton.com>`, // Sender address
//       to: userEmail, // List of receivers
//       subject: "OTP Verification", // Subject line
//       text: `Your OTP is: ${text}`, // Plain text body
//     });
//     console.log("Email sent successfully!");
//   } catch (error) {
//     console.error("Error sending email:", error);
//   }
// }
import nodemailer from "nodemailer";

// Replace with your actual Gmail address and the generated App Password
const gmailUser = "husarkar@enacton.com";
const gmailAppPassword = "guipixasbeocakbo"; // <<< REPLACE THIS WITH YOUR GENERATED APP PASSWORD

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailUser,
    pass: gmailAppPassword,
  },
});

export async function sendMail(userEmail: string, text: string) {
  try {
    await transporter.sendMail({
      from: `"Expence Tracker" <${gmailUser}>`, 
      to: userEmail, // List of receivers
      subject: "OTP Verification", // Subject line
      text: `Your OTP is: ${text}`, // Plain text body
      // You can also use an HTML body if you prefer:
      // html: `<p>Your OTP is: <strong>${text}</strong></p>`,
    });
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    // You might want to throw the error or handle it further depending on your application's needs.
    // throw error;
  }
}

// Example of how you might call this function:
/*
async function exampleUsage() {
  const recipientEmail = "testrecipient@example.com"; // Replace with a real email address for testing
  const otpCode = "123456"; // Replace with a generated OTP

  await sendMail(recipientEmail, otpCode);
}

exampleUsage();
*/