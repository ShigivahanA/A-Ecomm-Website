import Subscriber from '../models/subscriberModel.js';
import transporter from '../config/email.js';

// POST /api/newsletter/subscribe
export const subscribe = async (req, res) => {
  try {
    const emailRaw = (req.body?.email || '').toString();
    if (!emailRaw || !emailRaw.includes('@')) {
      return res.status(400).json({ success: false, message: 'Invalid email address.' });
    }
    const email = emailRaw.toLowerCase().trim();

    const existing = await Subscriber.findOne({ email });

    // 1) New subscriber (never existed)
    if (!existing) {
      const subscriber = new Subscriber({
        email,
        verified: true,
        createdAt: Date.now(),
        lastSubscribedAt: Date.now(),
      });
      await subscriber.save();

      // send welcome email
      try {
        await transporter.sendMail({
          from: `"MAYILÉ" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: 'Welcome to MAYILÉ Newsletter',
          html: `
            <p>Hi,</p>
            <p>Thank you for subscribing to MAYILÉ. Expect curated drops, exclusive previews, and special offers delivered to your inbox.</p>
            <p>As a welcome gift we offer 20% off your first order. Use code: <strong>WELCOME20</strong></p>
            <p>If you didn’t sign up, please ignore this email.</p>
            <p>Warmly,<br/>MAYILÉ</p>
          `
        });
      } catch (mailErr) {
        console.warn('welcome email failed', mailErr?.message || mailErr);
      }

      return res.json({ success: true, message: 'Subscribed successfully.', firstTime: true });
    }

    // 2) Already active subscriber
    if (!existing.unsubscribed) {
      return res.json({ success: true, message: 'You are already subscribed.', firstTime: !!(!existing.firstOrderDiscountUsed) });
    }

    // 3) Was unsubscribed — user is re-subscribing
    existing.unsubscribed = false;
    existing.resubscribeCount = (existing.resubscribeCount || 0) + 1;
    existing.lastSubscribedAt = Date.now();

    await existing.save();

    // send re-subscribe welcome (optional: you may NOT give discount if firstOrderDiscountUsed === true)
    try {
      await transporter.sendMail({
        from: `"MAYILÉ" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Welcome back to MAYILÉ Newsletter',
        html: `
          <p>Hi,</p>
          <p>Thanks for coming back. We'll keep you posted on new drops and offers.</p>
          ${existing.firstOrderDiscountUsed ? '<p>Note: the first-order welcome discount was already used on this email.</p>' : '<p>Use <strong>WELCOME20</strong> for 20% off your first order.</p>'}
          <p>Warmly,<br/>MAYILÉ</p>
        `
      });
    } catch (mailErr) {
      console.warn('resubscribe email failed', mailErr?.message || mailErr);
    }

    return res.json({
      success: true,
      message: 'Re-subscribed successfully.',
      firstTime: !existing.firstOrderDiscountUsed
    });

  } catch (err) {
    console.error('subscribe error', err);
    if (err.code === 11000) {
      return res.json({ success: true, message: 'You are already subscribed.' });
    }
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// POST /api/newsletter/unsubscribe
export const unsubscribe = async (req, res) => {
  try {
    const emailRaw = req.body?.email || req.query?.email;
    if (!emailRaw || typeof emailRaw !== 'string' || !emailRaw.includes('@')) {
      return res.status(400).json({ success: false, message: 'Invalid email address.' });
    }
    const email = emailRaw.toLowerCase().trim();

    // find subscriber — if not found, we still respond success but we also create a record in some flows
    const existing = await Subscriber.findOne({ email });

    if (!existing) {
      // Optionally create a record to mark they unsubscribed without ever being active
      const doc = new Subscriber({
        email,
        verified: false,
        unsubscribed: true,
        lastUnsubscribedAt: Date.now(),
        unsubscribeCount: 1,
      });
      await doc.save().catch(() => {});
      // respond generically
      return res.json({ success: true, message: 'Unsubscribe processed.' });
    }

    // Mark unsubscribed and increment counter (do NOT delete)
    existing.unsubscribed = true;
    existing.unsubscribeCount = (existing.unsubscribeCount || 0) + 1;
    existing.lastUnsubscribedAt = Date.now();
    await existing.save();

    // Optional: send confirmation email (best-effort)
    try {
      await transporter.sendMail({
        from: `"MAYILÉ" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'You have been unsubscribed',
        html: `<p>Hi,</p><p>You have been unsubscribed from MAYILÉ newsletters. We're sorry to see you go.</p><p>If this was a mistake, you can re-subscribe anytime at our site.</p>`,
      });
    } catch (mailErr) {
      console.warn('unsubscribe confirmation email failed', mailErr?.message || mailErr);
    }

    return res.json({ success: true, message: 'Unsubscribed successfully.' });
  } catch (err) {
    console.error('unsubscribe error', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// POST /api/newsletter/send  (ADMIN)
export const sendNewsletter = async (req, res) => {
  try {
    const { subject, html, audience = "active" } = req.body;

    if (!subject || !html) {
      return res.status(400).json({
        success: false,
        message: "Subject and content are required"
      });
    }

    // 🎯 Decide target group
    const query = { unsubscribed: false };

    if (audience === "verified") {
      query.verified = true;
    }

    const subscribers = await Subscriber.find(query).select("email");

    if (subscribers.length === 0) {
      return res.json({
        success: false,
        message: "No subscribers found for selected audience"
      });
    }

    // ✉️ Send emails (batch-safe)
    const sendPromises = subscribers.map(sub =>
      transporter.sendMail({
        from: `"MAYILÉ" <${process.env.EMAIL_USER}>`,
        to: sub.email,
        subject,
        html,
      }).catch(err => {
        console.warn(`Email failed for ${sub.email}`, err.message);
        return null;
      })
    );

    await Promise.all(sendPromises);

    return res.json({
      success: true,
      message: `Newsletter sent to ${subscribers.length} subscribers`
    });

  } catch (err) {
    console.error("sendNewsletter error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while sending newsletter"
    });
  }
};

