import { toast } from 'react-toastify';

export class ToastUtil {
  static displayInfoToast(message) {
    return toast.info(message);
  }

  static displaySuccessToast(message) {
    return toast.success(message);
  }

  static displayErrorToast(message) {
    return toast.error(message);
  }
}
