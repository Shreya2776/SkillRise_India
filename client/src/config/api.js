const baseApiUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/auth$/, "") : "http://localhost:8000";
const mockApiUrl = import.meta.env.VITE_MOCK_API_URL || "http://localhost:5050";
const analyzerApiUrl = import.meta.env.VITE_ANALYZER_API_URL || "http://localhost:5001";
const chatbotApiUrl = import.meta.env.VITE_CHATBOT_API_URL || "http://localhost:5002";

// Helper to ensure the URL has /api prefix and handle trailing slashes
const getBaseUrl = (url, prefix = "/api") => {
  const sanitized = url.replace(/\/$/, "");
  return sanitized.includes(prefix) ? sanitized : `${sanitized}${prefix}`;
};

export const API_ENDPOINTS = {
  AUTH: `${getBaseUrl(baseApiUrl)}/auth`,
  ADMIN: `${getBaseUrl(baseApiUrl)}/admin`,
  ROADMAP: `${getBaseUrl(baseApiUrl)}/roadmap`,
  PROFILE: `${getBaseUrl(baseApiUrl)}/profile`,
  BLOGS: `${getBaseUrl(baseApiUrl)}/blogs`,
  PROGRAMS: `${getBaseUrl(baseApiUrl)}/programs`,
  OPPORTUNITIES: `${getBaseUrl(baseApiUrl)}/opportunities`,
  MOCK_INTERVIEW: `${getBaseUrl(mockApiUrl)}/interviews`, // Assuming path based on common structure
  MOCK_AUTH: `${getBaseUrl(mockApiUrl)}/auth`,
  MOCK_VAPI: `${getBaseUrl(mockApiUrl)}/vapi`,
  ANALYZER: `${getBaseUrl(analyzerApiUrl)}/analyzer`,
  CHATBOT: `${getBaseUrl(chatbotApiUrl)}/chatbot`,
};

export default API_ENDPOINTS;
