import { redirect } from "react-router-dom";
import { deleteItem } from "../helpers";
import { toast } from "react-toastify";

export async function logoutAction() {
  // delete user
  deleteItem({ key: "userName" })
  toast.success("Your account has been deleted!")
  // return redirect
  return redirect("/")
}
