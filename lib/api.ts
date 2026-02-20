// In production, this should be set via NEXT_PUBLIC_API_URL environment variable
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? "https://api.betterbankings.com/api"
    : "http://localhost:8080/api");

// Export API_URL for use in other files
export { API_URL };

// Helper function to get the full API URL
export function getApiUrl(endpoint: string): string {
  return `${API_URL}${endpoint}`;
}

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = getApiUrl(endpoint);

  const defaultOptions: RequestInit = {
    credentials: "include", // Important for cookies
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || "Request failed");
  }

  return response.json();
}

// Auth API
export const authAPI = {
  signin: (data: { email: string; password: string }) =>
    apiRequest("/auth/signin", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  signup: (data: {
    email: string;
    password: string;
    name: string;
    phone?: string;
    position?: string;
    organization?: string;
  }) =>
    apiRequest("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getMe: () => apiRequest("/auth/me"),

  signout: () =>
    apiRequest("/auth/signout", {
      method: "POST",
    }),
};

// Basel Framework API
export const baselAPI = {
  getStandards: () => apiRequest("/basel/standards"),

  getChapters: (standardId?: string) =>
    apiRequest(
      `/basel/chapters${standardId ? `?standardId=${standardId}` : ""}`,
    ),

  getChapter: (id: string) => apiRequest(`/basel/chapters/${id}`),

  getSections: (chapterId?: string) =>
    apiRequest(`/basel/sections${chapterId ? `?chapterId=${chapterId}` : ""}`),

  getSubsections: (sectionId?: string) =>
    apiRequest(
      `/basel/subsections${sectionId ? `?sectionId=${sectionId}` : ""}`,
    ),

  getSubsection: (id: string) => apiRequest(`/basel/subsections/${id}`),

  search: (query: string) =>
    apiRequest(`/basel/search?q=${encodeURIComponent(query)}`),

  getUpdates: () => apiRequest("/basel/updates"),

  // Admin only
  createStandard: (data: any) =>
    apiRequest("/basel/standards", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  createChapter: (data: any) =>
    apiRequest("/basel/chapters", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  createSection: (data: any) =>
    apiRequest("/basel/sections", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  createSubsection: (data: any) =>
    apiRequest("/basel/subsections", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  createUpdate: (data: any) =>
    apiRequest("/basel/updates", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// Podcast (Angle) API
export const podcastAPI = {
  getCategories: () => apiRequest("/angle/categories"),

  getPodcasts: (categoryId?: string, search?: string) => {
    const params = new URLSearchParams();
    if (categoryId) params.append("categoryId", categoryId);
    if (search) params.append("search", search);
    return apiRequest(
      `/angle/podcasts${params.toString() ? `?${params}` : ""}`,
    );
  },

  getPodcast: (id: string) => apiRequest(`/angle/podcasts/${id}`),

  // Admin only
  createCategory: (data: { name: string; order?: number }) =>
    apiRequest("/angle/categories", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  createPodcast: (data: any) =>
    apiRequest("/angle/podcasts", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updatePodcast: (id: string, data: any) =>
    apiRequest(`/angle/podcasts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deletePodcast: (id: string) =>
    apiRequest(`/angle/podcasts/${id}`, {
      method: "DELETE",
    }),
};

// File Upload API
export async function uploadFile(file: File, folder: string = "uploads") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const response = await fetch(`${API_URL}/upload`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Upload failed" }));
    throw new Error(error.error || "Upload failed");
  }

  return response.json();
}

export async function uploadToVPS(file: File, folder: string = "uploads") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const response = await fetch(`${API_URL}/upload/vps`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Upload failed" }));
    throw new Error(error.error || "Upload failed");
  }

  return response.json();
}

export async function uploadToCloudinary(
  file: File,
  folder: string = "betterbankings",
) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const response = await fetch(`${API_URL}/upload/cloudinary`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Upload failed" }));
    throw new Error(error.error || "Upload failed");
  }

  return response.json();
}

export async function deleteFromVPS(filepath: string) {
  return apiRequest("/upload/vps", {
    method: "DELETE",
    body: JSON.stringify({ filepath }),
  });
}

export async function deleteFromCloudinary(publicId: string) {
  return apiRequest("/upload/cloudinary", {
    method: "DELETE",
    body: JSON.stringify({ publicId }),
  });
}

// Notifications API
export const notificationAPI = {
  getAll: () => apiRequest("/notifications"),

  getUnread: () => apiRequest("/notifications?unread=true"),

  markAsRead: (id: string) =>
    apiRequest(`/notifications/${id}/read`, {
      method: "POST",
    }),

  markAllAsRead: () =>
    apiRequest("/notifications/read-all", {
      method: "POST",
    }),

  // Admin only
  create: (data: {
    title: string;
    description: string;
    category: string;
    link?: string;
  }) =>
    apiRequest("/notifications", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest(`/notifications/${id}`, {
      method: "DELETE",
    }),
};

// Settings API
export const settingsAPI = {
  updateAccount: (data: {
    name?: string;
    phone?: string;
    position?: string;
    organization?: string;
  }) =>
    apiRequest("/settings/account", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiRequest("/settings/password", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

// Rate limiting / Count API
export const countAPI = {
  increment: () =>
    apiRequest("/count", {
      method: "POST",
    }),

  getStatus: () => apiRequest("/count/status"),
};

// B-Foresight API
export const foresightAPI = {
  getAnalysisBox: (page: string, tabKey: string) =>
    fetch(
      getApiUrl(
        `/foresight/analysis-box?page=${encodeURIComponent(page)}&tabKey=${encodeURIComponent(tabKey)}`,
      ),
      { credentials: "include" },
    ).then((res) => {
      if (!res.ok) return null;
      return res.json();
    }),

  upsertAnalysisBox: (data: {
    page: string;
    tabKey: string;
    content: string;
  }) =>
    apiRequest("/foresight/analysis-box", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteAnalysisBox: (page: string, tabKey: string) =>
    apiRequest(
      `/foresight/analysis-box?page=${encodeURIComponent(page)}&tabKey=${encodeURIComponent(tabKey)}`,
      { method: "DELETE" },
    ),
};
