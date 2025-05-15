// rrd imports
import { redirect } from "react-router-dom";

// library
import { toast } from "react-toastify";

export async function logoutAction() {
  // Remove user ID from localStorage
  localStorage.removeItem('userId');
  toast.success("You've logged out successfully!")
  // return redirect
  return redirect("/")
}