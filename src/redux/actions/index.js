import * as AuthActions from "./auth";
import * as NotiActions from "./notistack";

const exportsObj = {
  auth: {
    set_user: AuthActions.set_user,
    do_login: AuthActions.do_login,
    set_error: AuthActions.set_error,
    do_logout: AuthActions.set_logout,
    checkLogin: AuthActions.checkLogin,
    set_loading: AuthActions.set_loading,
  },
  notistack: {
    snackbar: NotiActions.snackBar,
    closeSnackbar: NotiActions.closeSnackbar,
    removeSnackbar: NotiActions.removeSnackbar,
    enqueueSnackbar: NotiActions.enqueueSnackbar,
  },
};

export default exportsObj;
