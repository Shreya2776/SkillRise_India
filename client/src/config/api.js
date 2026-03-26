const baseApiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
const mockApiUrl = import.meta.env.VITE_MOCK_API_URL || "http://localhost:5050";
const analyzerApiUrl = import.meta.env.VITE_ANALYZER_API_URL || "http://localhost:5001";
const chatbotApiUrl = import.meta.env.VITE_CHATBOT_API_URL || "http://localhost:5002";

// Normalize to bare origin + /api, regardless of what's in .env
const getBaseUrl = (url, prefix = "/api") => {
  const sanitized = url.replace(/\/$/, "");
  const apiIndex = sanitized.indexOf(prefix);
  const origin = apiIndex !== -1 ? sanitized.slice(0, apiIndex) : sanitized;
  return `${origin}${prefix}`;
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
