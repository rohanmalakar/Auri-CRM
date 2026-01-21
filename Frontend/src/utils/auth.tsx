// User logout
export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login"; // force redirect
};

// Admin logout
export const adminLogout = () => {
  localStorage.removeItem("token");
  window.location.href = "/admin/login"; // force redirect
};
