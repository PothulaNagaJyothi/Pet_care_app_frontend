import { useNavigate } from "react-router-dom";

function AuthRequiredModal({ onClose }) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="bg-gray-900 text-white p-8 rounded-lg w-96 text-center">
        <h2 className="text-xl font-semibold mb-4">
          Login Required
        </h2>

        <p className="text-gray-400 mb-6">
          You need to create an account or login to access this feature.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
          >
            Register
          </button>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthRequiredModal;