import { useState } from "react";
import { registerWithEmail, sendVerificationEmail } from "@/lib/firebase";

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

      // Send verification email
      await sendVerificationEmail();

      // Show verification message
      setVerificationSent(true);
    } catch (err: any) {
      // Firebase errors
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
          <p>Verification email has been sent. Please check your inbox to verify your email address.</p>
        </div>
      )}
    </div>
  );
};

export default SignUpModal;
