import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../services/auth.api";
import { clearToken } from "../../utils/auth";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getMe()
      .then((res) => setUser(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Failed to load profile")
      )
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    clearToken();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="card bg-base-100 shadow-md border border-base-300">
        <div className="card-body">
          {/* Avatar & Name */}
          <div className="flex flex-col items-center gap-3 mb-6">
            <div className="w-20 h-20 rounded-full bg-primary text-primary-content flex items-center justify-center text-3xl font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <h1 className="text-2xl font-bold">{user?.name}</h1>
            <span
              className={`badge ${
                user?.role === "admin" ? "badge-primary" : "badge-secondary"
              }`}
            >
              {user?.role}
            </span>
          </div>

          {/* User Info */}
          <div className="space-y-3 border-t border-base-300 pt-4">
            <div className="flex justify-between items-center py-2 border-b border-base-200">
              <span className="text-sm text-base-content/70">Full Name</span>
              <span className="font-semibold">{user?.name || "—"}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-base-200">
              <span className="text-sm text-base-content/70">Email</span>
              <span className="font-semibold">{user?.email || "—"}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-base-200">
              <span className="text-sm text-base-content/70">Role</span>
              <span className="font-semibold capitalize">
                {user?.role || "—"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-base-200">
              <span className="text-sm text-base-content/70">Account Status</span>
              <span
                className={`badge ${
                  user?.isBanned ? "badge-error" : "badge-success"
                }`}
              >
                {user?.isBanned ? "Banned" : "Active"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-base-200">
              <span className="text-sm text-base-content/70">Member Since</span>
              <span className="font-semibold">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "—"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-base-content/70">User ID</span>
              <span className="font-mono text-xs text-base-content/60">
                {user?._id || "—"}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6 pt-4 border-t border-base-300">
            <button
              onClick={() => navigate(-1)}
              className="btn btn-outline btn-sm flex-1"
            >
              ← Back
            </button>
            <button
              onClick={handleLogout}
              className="btn btn-error btn-sm flex-1"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}