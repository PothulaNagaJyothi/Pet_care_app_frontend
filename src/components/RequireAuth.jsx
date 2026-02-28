import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AuthRequiredModal from "./AuthRequiredModal";

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const [showModal, setShowModal] = useState(false);

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return (
      <>
        {showModal && (
          <AuthRequiredModal onClose={() => setShowModal(false)} />
        )}
        <div className="flex items-center justify-center min-h-screen bg-gray-950">
          <button
            onClick={() => setShowModal(true)}
            className="bg-purple-600 px-6 py-3 rounded hover:bg-purple-700 text-white"
          >
            Access Dashboard
          </button>
        </div>
      </>
    );
  }

  return children;
}

export default RequireAuth;