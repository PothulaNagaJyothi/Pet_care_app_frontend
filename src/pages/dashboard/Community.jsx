import { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";

function Community() {
  const { showToast } = useToast();
  const { user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await api.get("/community");
      setPosts(res.data.data);
    } catch {
      showToast("Failed to load community posts", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) return;

    try {
      setSubmitting(true);

      await api.post("/community", { content });

      setContent("");
      fetchPosts();
      showToast("Post shared successfully");
    } catch {
      showToast("Failed to create post", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/community/${id}`);
      setPosts(posts.filter((post) => post.id !== id));
      showToast("Post deleted");
    } catch {
      showToast("Delete failed", "error");
    }
  };

  return (
    <div className="space-y-12">

      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold">Community</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
          Share updates and connect with other pet owners.
        </p>
      </div>

      {/* Posts Feed */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400 text-lg">Loading posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            No posts yet. Be the first to share something.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id} className="p-6 space-y-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="flex items-center gap-3 sm:block w-full sm:w-auto pb-3 sm:pb-0 border-b border-slate-100 dark:border-slate-800 sm:border-0">
                  <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0 text-brand-600 dark:text-brand-400 font-bold text-lg">
                    {post.profiles?.full_name?.charAt(0) || <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>}
                  </div>
                  <div className="sm:hidden flex-1 flex items-center justify-between">
                    <p className="font-semibold text-slate-900 dark:text-white truncate pr-2">
                      {post.profiles?.full_name || "Pet Parent"}
                    </p>
                    <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <div className="flex-1 w-full mt-2 sm:mt-0">
                  <div className="hidden sm:flex items-center justify-between mb-2">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {post.profiles?.full_name || "Pet Parent"}
                    </p>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed text-lg break-words">
                    {post.content}
                  </p>
                  {post.user_id === user?.id && (
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-sm font-medium text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 transition-colors bg-rose-50 dark:bg-rose-500/10 px-3 py-1.5 rounded-lg"
                      >
                        Delete Post
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-slate-200 dark:border-slate-800 pt-10">
        <h2 className="text-2xl font-semibold mb-6">
          Share Something
        </h2>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              placeholder="Write about your pet..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full p-4 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium resize-none"
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={submitting} className="px-6 relative overflow-hidden group">
                {submitting ? "Posting..." : "Share Post"}
              </Button>
            </div>
          </form>
        </Card>
      </div>

    </div>
  );
}

export default Community;