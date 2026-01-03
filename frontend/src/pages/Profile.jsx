import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ToastProvider";
import { assets } from "../assets/assets";

export default function Profile() {
  const {
    user: userFromContext,
    orders: ordersFromContext,
    addresses: addressesFromContext,
    navigate: ctxNavigate,
    setToken,
    updateUserProfile,
    addUserAddress,
    updateUserAddress,
    deleteUserAddress,
    deleteUserAccount,
    changePasswordRequest,
    changePasswordConfirm,
    exportUserData
  } = useContext(ShopContext);

  const navigate = ctxNavigate || useNavigate();
  const { addToast } = useToast();

  // Local states mirroring context
  const [user, setUser] = useState(userFromContext || null);
  const [orders, setOrders] = useState(ordersFromContext || []);
  const [addresses, setAddresses] = useState(addressesFromContext || []);

  // UI states
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null); // address object or null

  // processing/loading states
  const [savingProfile, setSavingProfile] = useState(false);
  const [processingAddress, setProcessingAddress] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [processingDeleteAddress, setProcessingDeleteAddress] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  // sync context -> local
  useEffect(() => {
    setUser(userFromContext || null);
    setOrders(ordersFromContext || []);
    setAddresses(addressesFromContext || []);
  }, [userFromContext, ordersFromContext, addressesFromContext]);

  // ---------------- Profile modal handlers ----------------
  const openProfileModal = () => {
    setProfileModalOpen(true);
  };
  const closeProfileModal = () => {
    // reset local edit copy to context user
    setUser(userFromContext || user);
    setProfileModalOpen(false);
  };

  const handleProfileSave = async (updated) => {
    setSavingProfile(true);
    try {
      const res = await updateUserProfile({
        name: updated.name,
        phone: updated.phone,
      });

      if (!res.success) {
        alert(res.message || "Failed to update profile");
      } else {
        addToast({ message: "Profile updated successfully", type: "success" });
        setProfileModalOpen(false);
      }
    } catch (err) {
      console.error(err);
      alert("Profile update failed");
    } finally {
      setSavingProfile(false);
    }
  };

  // ---------------- Address modal handlers ----------------
  const handleOpenAddAddress = () => {
    setEditingAddress({
      id: `addr_${Date.now()}`,
      label: "",
      line1: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      phone: "",
    });
    setAddressModalOpen(true);
  };

  const handleOpenEditAddress = (addr) => {
    setEditingAddress({ ...addr });
    setAddressModalOpen(true);
  };

  const closeAddressModal = () => {
    setEditingAddress(null);
    setAddressModalOpen(false);
  };

  const handleSaveAddress = async (addr) => {
    if (!addr) return;
    setProcessingAddress(true);
    try {
      const exists = addresses.some((a) => a.id === addr.id);
      let res;
      if (exists) {
        res = await updateUserAddress(addr);
        addToast({ message: "Address updated successfully", type: "success" });
      } else {
        res = await addUserAddress(addr);
        addToast({ message: "Address created successfully", type: "success" });
      }
      if (!res.success) {
        alert(res.message || "Failed to save address");
      } else {
        setAddressModalOpen(false);
        setEditingAddress(null);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save address");
    } finally {
      setProcessingAddress(false);
    }
  };

  const handleDeleteAddress = async (addrId) => {
    if (!confirm("Delete this address permanently?")) return;
    setProcessingDeleteAddress(true);
    try {
      const res = await deleteUserAddress(addrId);
      if (!res.success) {
        alert(res.message || "Failed to delete address");
      } else {
        addToast({ message: "Address deleted", type: "success" });
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete address");
    } finally {
      setProcessingDeleteAddress(false);
    }
  };

  // ---------------- Account actions ----------------
  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure? This cannot be undone.")) return;
    setDeletingAccount(true);
    try {
      const res = await deleteUserAccount();
      if (!res.success) alert(res.message || "Failed to delete account");
      // deleteUserAccount in context handles logout/navigation
    } catch (err) {
      console.error(err);
      alert("Account deletion failed.");
    } finally {
      setDeletingAccount(false);
    }
  };

  const handleLogout = () => {
    if (!confirm("Log out?")) return;
    setToken(null);
    localStorage.removeItem("token");
    navigate("/");
  };

  // ---------------- small helpers ----------------
  const OrderRow = ({ order }) => (
    <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: "#eee" }}>
      <div>
        <div className="text-sm font-medium" style={{ color: "#000" }}>#{order._id || order.id}</div>
        <div className="text-xs" style={{ color: "#000" }}>
          {order.date ? new Date(order.date).toLocaleDateString() : ""}
        </div>
      </div>

      <div className="text-sm" style={{ color: "#000" }}>₹{order.amount || order.total || 0}</div>
      <div className="text-sm" style={{ color: "#000" }}>{order.status || "—"}</div>
    </div>
  );

  // ---------------- RETURN UI ----------------
  return (
    <main className="min-h-[70vh] bg-white text-black px-4 py-8 max-w-5xl mx-auto">
      <h2 className="text-2xl prata-regular font-semibold mb-6">My Profile</h2>

      {/* USER DETAILS */}
      <section className="mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 border p-4 rounded-xl p-4 bg-[#e5e5e5]" style={{ borderColor: "#eee" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg prata-regular">Account Details</h3>
              <button
                className="text-sm underline"
                onClick={openProfileModal}
                type="button"
              >
                Edit
              </button>
            </div>

            <div>
              <div className="mb-2">
                Name : <span>{user?.name || "—"}</span>
              </div>
              <div className="mb-2">Email : <span>{user?.email || "—"}</span></div>
              <div className="mb-2">Phone : <span>{user?.phone || "—"}</span></div>
            </div>
          </div>

          {/* ORDERS */}
          <div className="w-full md:w-1/2 border rounded-xl p-4 bg-[#e5e5e5]" style={{ borderColor: "#eee" }}>
            <h3 className="text-lg prata-regular mb-3">Recent Orders</h3>

            {(!orders || orders.length === 0) ? (
              <div className="text-sm text-gray-600">You have no recent orders.</div>
            ) : (
              <div>
                {orders.slice(0, 5).map((o) => (
                  <OrderRow key={o._id || o.id} order={o} />
                ))}
                <div className="mt-3 text-right">
                  <button
                    type="button"
                    className="text-sm underline"
                    onClick={() => navigate("/orders")}
                  >
                    View all orders
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ADDRESSES */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg prata-regular">Addresses</h3>
          <button
            type="button"
            onClick={handleOpenAddAddress}
            className="text-sm prata-regular underline"
          >
            + Add address
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(addresses || []).map((a) => (
            <div key={a.id} className="border rounded-xl p-3 bg-[#e5e5e5]" style={{ borderColor: "#eee" }}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium">{a.label || "Address"}</div>
                  <div className="text-sm">{a.line1}</div>
                  <div className="text-sm">{a.city}, {a.state} {a.zip}</div>
                  <div className="text-sm">{a.country}</div>
                  <div className="text-sm">Phone: {a.phone}</div>
                </div>

                <div className="flex flex-col gap-2 text-sm">
                  <button type="button" onClick={() => handleOpenEditAddress(a)} className="underline text-sm">Edit</button>
                  <button type="button" onClick={() => handleDeleteAddress(a.id)} className="underline text-sm">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg prata-regular">Account Settings</h3>
          <div className="text-sm text-gray-500">Manage security and sensitive actions</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Change password card */}
          <ActionCard
            title="Change password"
            description="Update your password, enable two-factor authentication, and manage session activity."
            primaryLabel="Change password"
            onPrimary={() => setShowChangePassword(true)}
            icon={
              <img src={assets.lock} alt="delete" className="w-5 h-5" />
            }
          />

          {/* Delete account card */}
          <ActionCard
            title="Delete account"
            description="Permanently remove your account and personal data. This is irreversible."
            primaryLabel={deletingAccount ? "Deleting..." : "Delete account"}
            primaryDisabled={deletingAccount}
            primaryStyle="bg-[#FF8A8A] hover:bg-red-600 text-white"
            onPrimary={() => setShowDeleteModal(true)}
            secondaryLabel="Export data"
            onSecondary={async () => {
              if (!exportUserData) {
                addToast({ message: "Export not available", type: "info" });
                return;
              }
              const res = await exportUserData();
              if (!res.success) {
                addToast({ message: res.message || "Export failed", type: "error" });
              }
            }}
            icon={
              <img src={assets.bin_icon} alt="delete" className="w-5 h-5" />
            }
          />
        </div>
      </section>

      {/* Confirm delete modal */}
      {showDeleteModal && (
        <ConfirmModal
          title="Delete account?"
          description="This will permanently delete your account, orders, and saved data. You will be logged out and cannot recover the account."
          confirmLabel={deletingAccount ? "Deleting..." : "Yes, delete account"}
          cancelLabel="Cancel"
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={async () => {
            setShowDeleteModal(false);
            // keep the original flow: handleDeleteAccount handles confirmation and API call
            await handleDeleteAccount();
          }}
          danger
        />
      )}

            {/* Change password modal */}
      {showChangePassword && (
        <ChangePasswordModal
          onClose={() => setShowChangePassword(false)}
          userEmail={user?.email}
        />
      )}


      {/* ---------------- Profile Modal ---------------- */}
      {profileModalOpen && (
        <Modal onClose={closeProfileModal}>
          <ProfileForm
            initial={{ name: user?.name || "", phone: user?.phone || "", email: user?.email || "" }}
            onCancel={closeProfileModal}
            onSave={(payload) => handleProfileSave(payload)}
            loading={savingProfile}
          />
        </Modal>
      )}

      {/* ---------------- Address Modal ---------------- */}
      {addressModalOpen && editingAddress && (
        <Modal onClose={closeAddressModal}>
          <AddressForm
            initial={editingAddress}
            onCancel={closeAddressModal}
            onSave={(addr) => handleSaveAddress(addr)}
            loading={processingAddress}
          />
        </Modal>
      )}
    </main>
  );
}

/* ----------------- ChangePasswordModal ----------------- */
/* ----------------- ChangePasswordModal (fixed) ----------------- */
function ChangePasswordModal({ onClose, userEmail }) {
  const { changePasswordRequest, changePasswordConfirm } = useContext(ShopContext);
  const { addToast } = useToast();

  // split loading states so sending OTP doesn't flip the "saving" UI
  const [sendingOtp, setSendingOtp] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    let t;
    if (secondsLeft > 0) {
      t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    }
    return () => clearTimeout(t);
  }, [secondsLeft]);

  const sendOtp = async () => {
    if (!userEmail) return addToast({ message: "No email available.", type: "error" });
    setSendingOtp(true);
    try {
      const res = await changePasswordRequest({ email: userEmail });
      if (!res || !res.success) {
        addToast({ message: res?.message || "Failed to send code", type: "error" });
      } else {
        setOtpSent(true);
        setSecondsLeft(120);
        addToast({ message: "OTP sent — check your email.", type: "success" });
      }
    } catch (err) {
      console.error(err);
      addToast({ message: err?.message || "Failed to send OTP", type: "error" });
    } finally {
      setSendingOtp(false);
    }
  };

  const verifyAndChange = async () => {
    if (!otp || otp.trim().length !== 6) return addToast({ message: "Enter the 6-digit code", type: "error" });
    if (!newPassword || newPassword.length < 8) return addToast({ message: "Password must be at least 8 characters", type: "error" });
    if (newPassword !== confirmPassword) return addToast({ message: "Passwords do not match", type: "error" });

    setSavingPassword(true);
    try {
      const res = await changePasswordConfirm({ email: userEmail, otp: otp.trim(), newPassword });
      if (!res || !res.success) {
        addToast({ message: res?.message || "Failed to change password", type: "error" });
      } else {
        addToast({ message: "Password changed successfully", type: "success" });
        onClose();
      }
    } catch (err) {
      console.error(err);
      addToast({ message: err?.message || "Failed to change password", type: "error" });
    } finally {
      setSavingPassword(false);
    }
  };

  const resend = async () => {
    if (secondsLeft > 0) return;
    await sendOtp();
  };

  return (
    <Modal onClose={onClose}>
      <div>
        <h3 className="text-lg font-semibold mb-3">Change password</h3>

        {!otpSent ? (
          <>
            <p className="text-sm text-gray-700 mb-3">
              We'll send a 6-digit one-time code to <strong>{userEmail}</strong>. Enter it here to verify and change your password.
            </p>

            <div className="flex gap-3">
              <button
                onClick={sendOtp}
                disabled={sendingOtp}
                className="px-4 py-2 bg-[#4A70A9] text-white rounded"
              >
                {sendingOtp ? "Sending..." : "Send code"}
              </button>

              <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-700 mb-3">Enter the 6-digit code and your new password.</p>

            <div className="grid grid-cols-1 gap-3">
              <OTPInput otp={otp} setOtp={setOtp} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm">New password</label>
                  <input
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="border px-3 py-2 rounded w-full"
                    type="password"
                    placeholder="At least 8 characters"
                  />
                </div>

                <div>
                  <label className="text-sm">Confirm password</label>
                  <input
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border px-3 py-2 rounded w-full"
                    type="password"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 mt-2">
                <div className="text-sm text-gray-600">
                  {secondsLeft > 0 ? `Resend in ${secondsLeft}s` : (
                    <button onClick={resend} className="underline text-sm">Resend code</button>
                  )}
                </div>

                <div className="flex gap-3">
                  <button onClick={onClose} className="px-3 py-2 border rounded">Cancel</button>
                  <button
                    onClick={verifyAndChange}
                    disabled={savingPassword}
                    className="px-3 py-2 bg-black text-white rounded"
                  >
                    {savingPassword ? "Saving..." : "Save new password"}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

/* ----------------- Reusable Modal ----------------- */
function Modal({ children, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    // prevent background scroll
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>

      {/* content box: make it responsive and scrollable for small screens */}
      <div className="relative z-10 w-full max-w-2xl bg-white text-black rounded-lg shadow-lg">
        <div className="p-6 max-h-[80vh] overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ----------------- ProfileForm ----------------- */
function ProfileForm({ initial, onSave, onCancel, loading }) {
  const [form, setForm] = useState(initial);

  useEffect(() => setForm(initial), [initial]);

  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const submit = () => {
    // basic validation
    if (!form.name.trim()) return alert("Please enter a name");
    onSave(form);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Edit Profile</h3>
      <div className="flex flex-col gap-3">
        <label className="text-sm">Name</label>
        <input name="name" value={form.name} onChange={handleChange} className="border px-3 py-2 rounded" />

        <label className="text-sm">Email</label>
        <input name="email" value={form.email} disabled className="border px-3 py-2 rounded bg-gray-100" />

        <label className="text-sm">Phone</label>
        <input name="phone" value={form.phone} onChange={handleChange} className="border px-3 py-2 rounded" />
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">
          Cancel
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={loading}
          className="px-4 py-2 bg-black text-white rounded"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}

/* ----------------- AddressForm (improved UI) ----------------- */
function AddressForm({ initial, onSave, onCancel, loading }) {
  const [addr, setAddr] = useState(initial);

  useEffect(() => setAddr(initial), [initial]);

  const handleChange = (e) => setAddr((s) => ({ ...s, [e.target.name]: e.target.value }));

  const submit = () => {
    if (!addr.line1?.trim()) return alert("Enter address line 1");
    if (!addr.city?.trim()) return alert("Enter city");
    onSave(addr);
  };

  const isNew = initial?.id?.startsWith("addr_");

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">{isNew ? "Add Address" : "Edit Address"}</h3>

      {/* Layout: stacked on small, two-column on md+ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="md:col-span-2">
          <label className="text-sm block mb-1">Label (Home / Work)</label>
          <input
            name="label"
            value={addr.label}
            onChange={handleChange}
            placeholder="Home"
            className="border px-3 py-2 rounded w-full"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm block mb-1">Address line 1</label>
          <input
            name="line1"
            value={addr.line1}
            onChange={handleChange}
            placeholder="Flat / Building / Street"
            className="border px-3 py-2 rounded w-full"
          />
        </div>

        <div>
          <label className="text-sm block mb-1">City</label>
          <input name="city" value={addr.city} onChange={handleChange} className="border px-3 py-2 rounded w-full" />
        </div>

        <div>
          <label className="text-sm block mb-1">State</label>
          <input name="state" value={addr.state} onChange={handleChange} className="border px-3 py-2 rounded w-full" />
        </div>

        <div>
          <label className="text-sm block mb-1">ZIP / PIN</label>
          <input name="zip" value={addr.zip} onChange={handleChange} className="border px-3 py-2 rounded w-full" />
        </div>

        <div>
          <label className="text-sm block mb-1">Country</label>
          <input name="country" value={addr.country} onChange={handleChange} className="border px-3 py-2 rounded w-full" />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm block mb-1">Phone</label>
          <input name="phone" value={addr.phone} onChange={handleChange} className="border px-3 py-2 rounded w-full" />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">
          Cancel
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={loading}
          className="px-4 py-2 bg-black text-white rounded"
        >
          {loading ? "Saving..." : isNew ? "Add address" : "Save address"}
        </button>
      </div>
    </div>
  );
}

/* ----------------- ActionCard ----------------- */
function ActionCard({
  title,
  description,
  primaryLabel,
  onPrimary,
  primaryDisabled,
  primaryStyle,
  secondaryLabel,
  onSecondary,
  icon,
}) {
  return (
    <div className="border rounded-xl p-4 bg-[#e5e5e5]" style={{ borderColor: "#eee" }}>
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/60 border" style={{ borderColor: "#ddd" }}>
          {icon}
        </div>

        <div className="flex-1">
          <div className="font-semibold prata-regular text-black">{title}</div>
          <div className="text-sm text-gray-600 mt-1">{description}</div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={onPrimary}
              disabled={primaryDisabled}
              className={`px-3 py-2 rounded-xl prata-regular border-none text-sm ${primaryStyle || "bg-[#4A70A9] text-white hover:opacity-95"}`}
              aria-disabled={primaryDisabled}
            >
              {primaryLabel}
            </button>

            {secondaryLabel && (
              <button
                onClick={onSecondary}
                className="px-3 py-2 rounded-xl prata-regular border text-sm"
                aria-label={secondaryLabel}
              >
                {secondaryLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------- ConfirmModal ----------------- */
function ConfirmModal({ title, description, onCancel, onConfirm, confirmLabel = "Confirm", cancelLabel = "Cancel", danger }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onCancel(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel}></div>

      <div className="relative z-10 w-full max-w-lg bg-white text-black rounded-lg shadow-lg">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-sm text-gray-700 mb-4">{description}</p>

          <div className="flex justify-end gap-3">
            <button onClick={onCancel} className="px-4 py-2 border rounded">{cancelLabel}</button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 rounded ${danger ? "bg-[#FF8A8A] text-white hover:bg-red-600" : "bg-[#4A70A9] text-white"}`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function OTPInput({ otp, setOtp }) {
  const boxes = 6;
  const refs = Array.from({ length: boxes }, () => React.createRef());

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return; // only numbers

    const newOtp = otp.split("");
    newOtp[index] = value;
    setOtp(newOtp.join(""));

    // move to next box
    if (value && index < boxes - 1) {
      refs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = otp.split("");
      newOtp[index - 1] = "";
      setOtp(newOtp.join(""));
      refs[index - 1].current.focus();
    }
  };

  return (
    <div className="flex gap-2 mt-1">
      {Array.from({ length: boxes }).map((_, i) => (
        <input
          key={i}
          ref={refs[i]}
          value={otp[i] || ""}
          onChange={(e) => handleChange(e.target.value, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          maxLength={1}
          inputMode="numeric"
          className="
            w-12 h-12 
            border rounded 
            text-center text-xl 
            focus:outline-none focus:border-black
          "
        />
      ))}
    </div>
  );
}
