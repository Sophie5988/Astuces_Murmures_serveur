import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Configuration du transporteur SMTP

const transporter = nodemailer.createTransport({
  service: "Gmail", // ou ton service SMTP (Gmail, Outlook, autre)
  auth: {
    user: process.env.EMAIL_USER, // ton adresse email
    pass: process.env.EMAIL_PASS, // ton mot de passe ou App Password
  },
});

// Email de confirmation d’inscription

export const sendConfirmationEmail = async (email, token) => {
  const mailOptions = {
    from: `"Astuces & Murmures" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Confirmation d'inscription",
    html: `
      <p>Bienvenue sur <b>Astuces & Murmures</b> 🌸</p>
      <p>Cliquez sur le lien suivant pour valider votre inscription :</p>
      <a href="${
        process.env.MODE === "development"
          ? process.env.API_URL
          : process.env.DEPLOY_BACK_URL
      }/user/verifyMail/${token}">Confirmer mon compte</a>
      <br/><br/>
      <p>Ce lien est valide pendant 2 minutes.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Email de réinitialisation de mot de passe

export const sendResetPasswordEmail = async (email, token) => {
  const mailOptions = {
    from: `"Astuces & Murmures" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Réinitialisation de votre mot de passe",
    html: `
      <p>Bonjour,</p>
      <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
      <p>Cliquez sur le lien suivant pour définir un nouveau mot de passe :</p>
      <a href="${
        process.env.MODE === "development"
          ? process.env.CLIENT_URL
          : process.env.DEPLOY_FRONT_URL
      }/reset-password/${token}">Réinitialiser mon mot de passe</a>
      <br/><br/>
      <p>⚠️ Ce lien est valable pendant 1 heure.</p>
      <p>Si vous n’êtes pas à l’origine de cette demande, ignorez cet email.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
