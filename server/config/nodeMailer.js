import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  host: "smtp",
});

export default transporter;
