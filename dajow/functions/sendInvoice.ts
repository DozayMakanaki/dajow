import * as functions from "firebase-functions"
import * as nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your@gmail.com",
    pass: "APP_PASSWORD",
  },
})

export const sendInvoiceOnPaid = functions.firestore
  .document("orders/{id}")
  .onUpdate(async (change) => {
    const before = change.before.data()
    const after = change.after.data()

    if (before.status !== "paid" && after.status === "paid") {
      await transporter.sendMail({
        to: after.email,
        subject: "Your Invoice",
        html: `<h3>Thank you</h3><p>Total: ₦${after.total}</p>`,
      })
    }
  })
