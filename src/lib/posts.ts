import { API_BASE } from "./config";

type FetchFeedArgs = {
  page?: number;
  limit?: number;
  category?: string | null;
  lowDopamineOnly?: boolean;
  sortBy?: string | null;
  token?: string | null;
};

async function request(url: string, opts: RequestInit = {}) {
  const res = await fetch(url, opts);

  // Parse response body defensively. In some environments the body stream
  // may have been read by instrumentation (e.g. FullStory) causing a
  // "body stream already read" error when calling res.text()/res.json().
  // We try multiple safe approaches and fall back to null.
  let data: any = null;
  try {
    // Prefer cloning the response so reading won't affect other consumers.
    const text = await res.clone().text();
    try {
      data = text ? JSON.parse(text) : null;
    } catch (e) {
      // Not JSON, keep text as-is
      data = text;
    }
  } catch (e) {
    // clone().text() can fail if the body was already consumed by something else.
    // Try res.json() as a last resort, wrapped in try/catch.
    try {
      data = await res.json();
    } catch (err) {
      // Give up parsing body
      data = null;
    }
  }

  if (!res.ok) {
    const message = (data && (data.message || data.error)) || res.statusText || "Request failed";
    throw new Error(message);
  }

  return data;
}

export async function fetchFeed({ page=1, limit=10, category, lowDopamineOnly=false, sortBy, token }: FetchFeedArgs) {
  const q = new URLSearchParams();
  q.set("page", String(page));
  q.set("limit", String(Math.min(limit || 10, 50)));
  if (category) q.set("category", category);
  if (lowDopamineOnly) q.set("lowDopamineOnly", String(Boolean(lowDopamineOnly)));
  if (sortBy) q.set("sortBy", sortBy);

  const url = `${API_BASE}/posts/feed?${q.toString()}`;
  const headers: Record<string,string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const data = await request(url, { method: "GET", headers, credentials: "include" });

  // Normalize response: support { success, data: { posts } } or direct array
  if (data?.success && data?.data) return data.data;
  if (Array.isArray(data)) return { posts: data };
  return data;
}

export async function fetchReels({ page=1, limit=10, lowDopamineOnly=false, token }: { page?: number; limit?: number; lowDopamineOnly?: boolean; token?: string | null }) {
  const q = new URLSearchParams();
  q.set("page", String(page));
  q.set("limit", String(Math.min(limit || 10, 50)));
  if (lowDopamineOnly) q.set("lowDopamineOnly", String(Boolean(lowDopamineOnly)));
  const url = `${API_BASE}/posts/reels?${q.toString()}`;
  const headers: Record<string,string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const data = await request(url, { method: "GET", headers, credentials: "include" });
  if (data?.success && data?.data) return data.data;
  if (Array.isArray(data)) return { reels: data };
  return data;
}

export async function fetchUserPosts(userId?: string | null, { page=1, limit=10, token }: { page?: number; limit?: number; token?: string | null } = {}) {
  const q = new URLSearchParams();
  q.set("page", String(page));
  q.set("limit", String(Math.min(limit || 10, 50)));
  const path = userId ? `${API_BASE}/posts/user/${encodeURIComponent(userId)}?${q.toString()}` : `${API_BASE}/posts/user?${q.toString()}`;
  const headers: Record<string,string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const data = await request(path, { method: "GET", headers, credentials: "include" });
  if (data?.success && data?.data) return data.data;
  if (Array.isArray(data)) return { posts: data };
  return data;
}

export async function getPost(postId: string, token?: string | null) {
  const url = `${API_BASE}/posts/${encodeURIComponent(postId)}`;
  const headers: Record<string,string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return request(url, { method: "GET", headers, credentials: "include" });
}

export async function createPost(form: FormData, token?: string | null) {
  const url = `${API_BASE}/posts/create`;
  const headers: Record<string,string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  // DO NOT set content-type; browser will set multipart boundary
  return request(url, { method: "POST", body: form, headers, credentials: "include" });
}

export async function updatePost(postId: string, payload: Record<string, any>, token?: string | null) {
  const url = `${API_BASE}/posts/${encodeURIComponent(postId)}`;
  const headers: Record<string,string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return request(url, { method: "PATCH", body: JSON.stringify(payload), headers, credentials: "include" });
}

export async function deletePost(postId: string, token?: string | null) {
  const url = `${API_BASE}/posts/${encodeURIComponent(postId)}`;
  const headers: Record<string,string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return request(url, { method: "DELETE", headers, credentials: "include" });
}

export async function toggleLike(postId: string | number, token?: string | null) {
  const url = `${API_BASE}/posts/${encodeURIComponent(String(postId))}/like`;
  const headers: Record<string,string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return request(url, { method: "POST", headers, credentials: "include" });
}

export default {
  fetchFeed,
  fetchReels,
  fetchUserPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
};
