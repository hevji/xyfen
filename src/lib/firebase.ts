import { useState } from "react";
import { registerWithEmail, getAuth } from "@/lib/firebase";

const SignUpModal = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    setError("");
    try {
      // Register the user
      await registerWithEmail(email, password);

      // Wait until currentUser is available
      const auth = getAuth();
      let user = auth?.currentUser;
      let attempts = 0;

      while (!user && attempts < 10) { // retry up to ~1 second
        await new Promise((r) => setTimeout(r, 100));
        user = auth?.currentUser;
        attempts++;
      }

      if (!user) {
        throw new Error("User not found after registration. Please try logging in.");
      }

      // Send verification email
      if (user.sendEmailVerification) {
        await user.sendEmailVerification();
      } else {
        throw new Error("sendEmailVerification not available on this user.");
      }

      // Show verification message
      setVerificationSent(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="modal">
      {!verificationSent ? (
        <div className="modal-content">
          <h2>Sign Up</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleSignUp}>Sign Up</button>
          {error && <p className="error">{error}</p>}
        </div>
      ) : (
        <div className="modal-content">
          <h2>Check Your Email</h2>
          <p>
            Verification email has been sent. Please check your inbox to verify your email address.
          </p>
          <p>If you don’t see it, check your spam folder.</p>
        </div>
      )}
    </div>
  );
};

export default SignUpModal;
