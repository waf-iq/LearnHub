import { toast, Slide, ToastPosition } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export type Notification = {
  type: "success" | "warning" | "error";
  message: string;
};

const options = {
  position: "top-right" as ToastPosition,
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
  transition: Slide,
};

function showNotification(notification: Notification) {
  if (notification.type === "success") {
    toast.success(notification.message, options);
  }

  if (notification.type === "warning") {
    toast.warn(notification.message, options);
  }

  if (notification.type === "error") {
    toast.error(notification.message, options);
  }
}

export { showNotification };
