import validator from "validator";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import userModel from "../models/userModel.js";
import transporter from "../config/email.js";
import orderModel from "../models/orderModel.js"; 
import PDFDocument from "pdfkit";
import { unlink } from "fs/promises";
import path from "path";

// OTP helpers (paste after imports)
function generateNumericOtp(length = 6) {
  return Math.floor(100000 + Math.random() * 900000).toString().slice(0, length);
}

async function hashOtp(otp) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(otp, salt);
}

async function verifyOtpHash(otp, hash) {
  return bcrypt.compare(otp, hash);
}

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const MAX_OTP_ATTEMPTS = 5;        // number of allowed verification attempts
const RESEND_COOLDOWN_MS = 60 * 1000;


const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

// Route for user login
const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exists" })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {

            const token = createToken(user._id)
            res.json({ success: true, token })

        }
        else {
            res.json({ success: false, message: 'Invalid credentials' })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for user register
const registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        // checking user already exists or not
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" })
        }

        // validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })

        const user = await newUser.save()

        const token = createToken(user._id)

        res.json({ success: true, token })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      // Sign a payload object which adminAuth expects
      const token = jwt.sign({ role: "admin", email }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.json({ success: true, token });
    } else {
      return res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};



// GET USER PROFILE
const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userModel.findById(userId).select("-password");
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        res.json({
            success: true,
            user
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};



// -------- PROFILE: Update User Info --------
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone } = req.body;

    await userModel.findByIdAndUpdate(userId, { name, phone });

    res.json({ success: true, message: "Profile updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// -------- ADDRESS: Add New Address --------
const addAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const address = req.body;

    if (!address.id) {
      address.id = `addr_${Date.now()}`;
    }

    await userModel.findByIdAndUpdate(userId, {
      $push: { addresses: address }
    });

    res.json({ success: true, message: "Address added", address });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// -------- ADDRESS: Update Existing Address --------
const updateAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const address = req.body;

    const result = await userModel.updateOne(
      { _id: userId, "addresses.id": address.id },
      {
        $set: {
          "addresses.$": address
        }
      }
    );

    if (result.modifiedCount === 0) {
      return res.json({ success: false, message: "Address not found" });
    }

    res.json({ success: true, message: "Address updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// -------- ADDRESS: Delete Address --------
const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.body;

    await userModel.findByIdAndUpdate(userId, {
      $pull: { addresses: { id: addressId } }
    });

    res.json({ success: true, message: "Address removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// -------- Delete Account --------
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    await userModel.findByIdAndDelete(userId);

    res.json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


const sendPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    const normalized = String(email).trim().toLowerCase();
    const user = await userModel.findOne({ email: normalized });

    // Always return the same message to avoid email enumeration
    const genericSuccess = { success: true, message: "If an account exists, an OTP has been sent." };

    if (!user) {
      // respond success but do not reveal non-existence
      return res.status(200).json(genericSuccess);
    }

    // Throttle repeated sends: ensure at least RESEND_COOLDOWN_MS since last send attempt
    if (user.passwordResetOtpLastAttempt && (Date.now() - new Date(user.passwordResetOtpLastAttempt).getTime()) < RESEND_COOLDOWN_MS) {
      // still return generic to avoid enumeration, but with 429 status to hint rate-limit
      return res.status(429).json({ success: true, message: "Please wait before requesting another code." });
    }

    // generate OTP and store hashed version + expiry
    const otp = generateNumericOtp(6);
    const hashed = await hashOtp(otp);

    user.passwordResetOtpHash = hashed;
    user.passwordResetOtpExpires = new Date(Date.now() + OTP_TTL_MS);
    user.passwordResetOtpAttempts = 0; // reset verification attempts
    user.passwordResetOtpLastAttempt = new Date();
    await user.save();

    // send email (do not include OTP in any logs)
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: normalized,
      subject: "Your Password Reset Code",
      text: `Your verification code is ${otp}. It expires in 10 minutes.`,
    });

    return res.status(200).json(genericSuccess);
  } catch (error) {
    console.error("sendPasswordOtp:", error);
    // Do NOT leak internal error details to client
    return res.status(500).json({ success: false, message: "Error sending OTP" });
  }
};


const changePasswordWithOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const normalized = String(email).trim().toLowerCase();
    const user = await userModel.findOne({ email: normalized });
    if (!user) {
      // generic message to avoid account enumeration
      return res.status(400).json({ success: false, message: "Invalid request" });
    }

    // Ensure an OTP request exists
    if (!user.passwordResetOtpHash || !user.passwordResetOtpExpires) {
      return res.status(400).json({ success: false, message: "OTP not requested" });
    }

    // Expiry check
    if (new Date(user.passwordResetOtpExpires).getTime() < Date.now()) {
      // clear the stored otp fields to require a fresh request next time
      user.passwordResetOtpHash = null;
      user.passwordResetOtpExpires = null;
      user.passwordResetOtpAttempts = 0;
      user.passwordResetOtpLastAttempt = null;
      await user.save();
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    // Throttle / limit verification attempts
    user.passwordResetOtpAttempts = (user.passwordResetOtpAttempts || 0) + 1;
    user.passwordResetOtpLastAttempt = new Date();

    if (user.passwordResetOtpAttempts > MAX_OTP_ATTEMPTS) {
      // clear OTP so attacker must request a new one
      user.passwordResetOtpHash = null;
      user.passwordResetOtpExpires = null;
      await user.save();
      return res.status(429).json({ success: false, message: "Too many attempts. Request a new code." });
    }

    // verify provided OTP against stored hash
    const validOtp = await verifyOtpHash(String(otp), user.passwordResetOtpHash);

    if (!validOtp) {
      await user.save(); // persist incremented attempt counter
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // OTP is valid — update password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // clear OTP fields and attempts
    user.passwordResetOtpHash = null;
    user.passwordResetOtpExpires = null;
    user.passwordResetOtpAttempts = 0;
    user.passwordResetOtpLastAttempt = null;
    await user.save();

    // notify user
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: normalized,
        subject: "Password Changed Successfully",
        text: "Your password has been updated. If you did not perform this action, contact support.",
      });
    } catch (emailErr) {
      console.error("changePasswordWithOtp: sendMail failed", emailErr);
      // don't fail the whole request if email sending fails
    }

    return res.status(200).json({ success: true, message: "Password changed" });
  } catch (error) {
    console.error("changePasswordWithOtp:", error);
    return res.status(500).json({ success: false, message: "Error changing password" });
  }
};


const exportUserData = async (req, res) => {
  try {
    const userId = req.user.id;

    // fetch safe user info (exclude password)
    const user = await userModel.findById(userId).select("-password").lean();
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // fetch user's orders (if you have an order model)
    let orders = [];
    try {
      orders = await orderModel.find({ user: userId }).lean();
    } catch (e) {
      orders = [];
    }

    // Build filename
    const filename = `user-data-${userId}-${new Date().toISOString().slice(0,10)}.pdf`;

    // Set headers for PDF download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");

    // create PDF doc and stream to response
    const doc = new PDFDocument({ size: "A4", margin: 48 });

    // pipe PDF to response
    doc.pipe(res);

    // Header
    doc
      .fontSize(18)
      .text("User Data Export", { align: "center" })
      .moveDown(0.5);

    doc
      .fontSize(10)
      .fillColor("gray")
      .text(`Exported: ${new Date().toLocaleString()}`, { align: "center" })
      .moveDown(1);

    // User info section
    doc.fillColor("black").fontSize(12).text("User information", { underline: true });
    doc.moveDown(0.3);

    const userRows = [
      ["Name", user.name || ""],
      ["Email", user.email || ""],
      ["Phone", user.phone || ""],
      ["Joined", user.createdAt ? new Date(user.createdAt).toLocaleString() : ""],
    ];

    userRows.forEach(([k, v]) => {
      doc.fontSize(11).text(`${k}: `, { continued: true }).font("Helvetica").text(String(v || "—"));
    });

    doc.moveDown(1);

    // Addresses
    doc.fontSize(12).text("Addresses", { underline: true });
    doc.moveDown(0.3);
    if (Array.isArray(user.addresses) && user.addresses.length > 0) {
      user.addresses.forEach((a, idx) => {
        doc.fontSize(11).text(`${idx + 1}. ${a.label || "Address"}`);
        doc.fontSize(10).fillColor("gray").text(`${a.line1 || ""} ${a.line2 ? "- " + a.line2 : ""}`);
        doc.fontSize(10).fillColor("gray").text(`${a.city || ""} ${a.state ? ", " + a.state : ""} ${a.zip || ""}`);
        doc.fontSize(10).fillColor("gray").text(`${a.country || ""} | Phone: ${a.phone || ""}`);
        doc.moveDown(0.4);
        doc.fillColor("black");
      });
    } else {
      doc.fontSize(10).text("No saved addresses.");
      doc.moveDown(0.5);
    }

    doc.moveDown(0.6);

    // Orders table header
    doc.fontSize(12).fillColor("black").text("Orders", { underline: true });
    doc.moveDown(0.4);

    if (orders.length === 0) {
      doc.fontSize(10).fillColor("gray").text("No orders found.");
    } else {
      // For each order print summary and items
      orders.forEach((order, oi) => {
        doc.fontSize(11).fillColor("black").text(`Order ${oi + 1} — ${order._id || ""}`);
        doc.fontSize(10).fillColor("gray").text(`Date: ${order.date ? new Date(order.date).toLocaleString() : ""}  |  Status: ${order.status || ""}  |  Payment: ${order.paymentMethod || order.payment || ""}`);
        doc.moveDown(0.2);

        if (Array.isArray(order.items) && order.items.length > 0) {
          order.items.forEach((it, ii) => {
            const itemLine = `  • ${it.name || "Item"} — ${it.quantity || 1} × ${it.size || ""}  @ ${it.price ? (it.price) : ""}`;
            doc.fontSize(10).fillColor("black").text(itemLine);
          });
        } else {
          doc.fontSize(10).fillColor("gray").text("  (no items recorded)");
        }

        doc.moveDown(0.6);

        // add page break if near bottom
        if (doc.y > 720) doc.addPage();
      });
    }

    // Footer / signature
    doc.moveDown(1);
    doc.fontSize(10).fillColor("gray").text("Provided by MAYILÉ", { align: "center" });

    // finalize PDF
    doc.end();

    // no explicit res.send — stream will end when doc.end() called
  } catch (error) {
    console.error("exportUserData:", error);
    return res.status(500).json({ success: false, message: "Failed to export user data" });
  }
};

const sendCustomDesign = async (req, res) => {
  try {
    // fields (multer will have parsed them)
    const { name, email, phone, message, fabric, budget, timeline, subject } = req.body;
    const files = Array.isArray(req.files) ? req.files : [];

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "Missing required fields (name, email, message)" });
    }

    // Generate a small request id for tracking
    const requestId = `CD-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;

    // Validate uploaded files: only images allowed (defensive)
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    for (const f of files) {
      if (!f) continue;
      if (f.mimetype && !allowed.includes(f.mimetype)) {
        return res.status(400).json({ success: false, message: "Only image files are allowed as attachments." });
      }
    }

    // Build a simple, mobile-friendly HTML email for your team
    const html = `
      <div style="font-family: Arial, Helvetica, sans-serif; color: #111; line-height: 1.4;">
        <h2 style="margin-bottom:4px;">${escapeHtml(subject || "Custom design request")}</h2>
        <p><strong>Request ID:</strong> ${escapeHtml(requestId)}</p>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone || "—")}</p>
        <p><strong>Fabric / preference:</strong> ${escapeHtml(fabric || "—")}</p>
        <p><strong>Budget:</strong> ${escapeHtml(budget || "—")}</p>
        <p><strong>Timeline:</strong> ${escapeHtml(timeline || "—")}</p>
        <hr/>
        <h3 style="margin-bottom:4px;">Message</h3>
        <p>${nl2br(escapeHtml(message))}</p>
        <hr/>
        <p style="font-size:12px;color:#666">Attached references are included as attachments below.</p>
      </div>
    `;

    // Prepare attachments for nodemailer (disk storage -> use only existing paths)
    const attachments = files
      .filter((f) => f && f.path)
      .map((f) => ({ filename: f.originalname || path.basename(f.path || ""), path: f.path }));

    const mailOptions = {
      from: process.env.EMAIL_USER || process.env.MAIL_FROM || "no-reply@example.com",
      to: process.env.MAIL_TO || process.env.EMAIL_USER, // set MAIL_TO in env to receive these
      subject: `${subject || "New custom design request"} — ${requestId}`,
      html,
      attachments,
    };

    // ----- SEND MAIL TO TEAM -----
    try {
      await transporter.sendMail(mailOptions);
    } catch (sendErr) {
      console.error("sendCustomDesign: failed sending team email", sendErr);

      // Attempt cleanup (best-effort) then return error
      try {
        if (Array.isArray(files) && files.length > 0) {
          await Promise.all(
            files
              .filter((f) => f && f.path)
              .map((f) => unlink(path.resolve(f.path)).catch((e) => console.error("unlink failed", f.path, e)))
          );
        }
      } catch (ignore) {}

      return res.status(500).json({ success: false, message: "Failed to send request to team" });
    }

    // ----- SEND ACKNOWLEDGEMENT EMAIL TO SENDER -----
    const ackHtml = `
      <div style="font-family: Arial, sans-serif; color:#222; line-height:1.6; max-width:480px; margin:auto;">
        <h2 style="margin-bottom:8px;">Thank you — we received your request</h2>

        <p>Hi <strong>${escapeHtml(name)}</strong>,</p>

        <p>Thanks for sharing your design idea. We’ve received your request (ID: <strong>${escapeHtml(requestId)}</strong>) and references — our team will review it and get back to you soon with next steps.</p>

        <p style="margin-top:12px;">
          <strong>Summary:</strong><br/>
          • Fabric preference: ${escapeHtml(fabric || "—")}<br/>
          • Budget: ${escapeHtml(budget || "—")}<br/>
          • Timeline: ${escapeHtml(timeline || "—")}
        </p>

        <p>If you need to update anything, reply to this email and include the request ID above.</p>

        <p style="margin-top:18px; font-size:13px; color:#666;">
          Warm regards,<br/>MAYILÉ Team
        </p>
      </div>
    `;

    const ackMail = {
      from: process.env.EMAIL_USER || process.env.MAIL_FROM || "no-reply@example.com",
      to: email, // send to customer
      subject: `We received your custom design request — ${requestId}`,
      html: ackHtml,
      text: `Hi ${name || ""},\n\nThanks — we've received your custom design request (ID: ${requestId}). We will review and get back to you soon.\n\nSummary:\n- Fabric: ${fabric || "—"}\n- Budget: ${budget || "—"}\n- Timeline: ${timeline || "—"}\n\nReply to this email if you want to update anything.\n\n— MAYILÉ Team`,
    };

    try {
      await transporter.sendMail(ackMail);
    } catch (ackErr) {
      // log but do not fail the request
      console.error("sendCustomDesign: acknowledgement email failed", ackErr);
    }

    // ----- CLEANUP UPLOADED FILES FROM DISK (best-effort) -----
    if (Array.isArray(files) && files.length > 0) {
      try {
        await Promise.all(
          files
            .filter((f) => f && f.path)
            .map((f) => unlink(path.resolve(f.path)).catch((e) => {
              console.error("sendCustomDesign: cleanup unlink failed for", f.path, e);
            }))
        );
      } catch (cleanupErr) {
        console.error("sendCustomDesign: cleanup error", cleanupErr);
      }
    }

    // FINAL RESPONSE
    return res.json({ success: true, message: "Request received and emailed to the team.", requestId });
  } catch (err) {
    console.error("sendCustomDesign:", err);

    // Attempt to remove uploaded files even on error (best-effort)
    try {
      if (Array.isArray(req.files)) {
        await Promise.all(req.files.map((f) => f && f.path ? unlink(path.resolve(f.path)).catch(() => {}) : Promise.resolve()));
      }
    } catch (ignore) {
      // ignore
    }

    return res.status(500).json({ success: false, message: "Failed to process request" });
  }
};

/* Small helpers: escape and nl2br */
function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
function nl2br(s = "") {
  return String(s).replace(/\r\n|\n/g, "<br/>");
}

export { 
  loginUser, 
  registerUser, 
  adminLogin,
  getProfile,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  deleteAccount,
  sendPasswordOtp,
  changePasswordWithOtp,
  exportUserData,
  sendCustomDesign
}
