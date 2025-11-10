
const {resendClient,sender} = require("../lib/resend.js");
const createWelcomeEmailTemplate = require("../emails/emailTemplates.js");

 const sendWelcomeEmail = async (email, name, clientURL) => {
  const { data, error } = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: email,
    subject: "Welcome to Chatify!",
    html: createWelcomeEmailTemplate(name, clientURL),
  });

  if (error) {
    console.error("Error sending welcome email:", error);
    throw new Error("Failed to send welcome email");
  }

  if(data){
    console.log(data);
  }

  console.log("Welcome Email sent successfully", data);
};


module.exports = sendWelcomeEmail;