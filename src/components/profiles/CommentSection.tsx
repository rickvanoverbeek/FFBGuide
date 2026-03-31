"use client";

import { useEffect, useState, useCallback } from "react";
import { MessageSquare, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { getComments, createComment, updateComment, deleteComment } from "@/lib/supabase/queries";
import { formatDate } from "@/lib/utils";
import type { ProfileComment } from "@/types";

interface CommentSectionProps {
  profileId: string;
  currentUserId: string | null;
}

type CommentWithUser = ProfileComment & { user: ProfileComment["user"] };

export function CommentSection({ profileId, currentUserId }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const supabase = createClient();

  const fetchComments = useCallback(async () => {
    const { data } = await getComments(supabase, profileId);
    if (data) setComments(data as CommentWithUser[]);
    setLoading(false);
  }, [profileId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUserId || !newComment.trim()) return;
    setSubmitting(true);
    const { data } = await createComment(supabase, profileId, currentUserId, newComment.trim());
    if (data) {
      setComments((prev) => [...prev, data as CommentWithUser]);
      setNewComment("");
    }
    setSubmitting(false);
  }

  async function handleUpdate(id: string) {
    if (!editContent.trim()) return;
    await updateComment(supabase, id, editContent.trim());
    setComments((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, content: editContent.trim(), is_edited: true } : c
      )
    );
    setEditingId(null);
    setEditContent("");
  }

  async function handleDelete(id: string) {
    await deleteComment(supabase, id);
    setComments((prev) => prev.filter((c) => c.id !== id));
    setDeleteConfirmId(null);
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        Comments ({comments.length})
      </h3>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-lg border border-border bg-card p-4 space-y-2"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {comment.user?.avatar_url ? (
                    <img
                      src={comment.user.avatar_url}
                      alt=""
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                      {(comment.user?.display_name ?? comment.user?.username ?? "?")[0]?.toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-medium">
                    {comment.user?.display_name ?? comment.user?.username ?? "Unknown"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(comment.created_at)}
                    {comment.is_edited && " (edited)"}
                  </span>
                </div>

                {currentUserId === comment.user_id && (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => {
                        setEditingId(comment.id);
                        setEditContent(comment.content);
                      }}
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                      onClick={() => setDeleteConfirmId(comment.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Body */}
              {editingId === comment.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full rounded-lg border border-border bg-muted p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[80px] resize-y"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleUpdate(comment.id)}>
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingId(null);
                        setEditContent("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-foreground whitespace-pre-wrap">{comment.content}</p>
              )}

              {/* Delete confirmation */}
              {deleteConfirmId === comment.id && (
                <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-2 text-sm">
                  <span>Delete this comment?</span>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(comment.id)}
                  >
                    Delete
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setDeleteConfirmId(null)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add comment form */}
      {currentUserId ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your experience with this profile..."
            className="w-full rounded-lg border border-border bg-muted p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[100px] resize-y"
          />
          <Button type="submit" size="sm" loading={submitting} disabled={!newComment.trim()}>
            Post Comment
          </Button>
        </form>
      ) : (
        <p className="text-sm text-muted-foreground">
          <a href="/account/login" className="text-primary hover:underline">
            Sign in
          </a>{" "}
          to leave a comment.
        </p>
      )}
    </div>
  );
}
