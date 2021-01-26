import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import GLOBALS from "../globals";
import Loader from "../components/Loader";

import UnAuth from "../pages/UnAuth";
import SuperAdmin from "../pages/SuperAdmin";

export default function Main() {
  const store = useSelector((state) => state);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    checkLogin();
    // eslint-disable-next-line
  }, []);

  const checkLogin = async () => {
    try {
      const token = localStorage.getItem("test");
      if (!token) {
        setLoading(false);
        return;
      }

      // const data = await GLOBALS.API({
      //   uri: GLOBALS.Constants.GET_PROFILE,
      //   token: token,
      // });
      dispatch({
        type: GLOBALS.ActionTypes.LOGIN,
        user: "data.user",
        token: "token",
      });
      setLoading(false);
    } catch (err) {
      localStorage.removeItem("token");
      console.log(err);
    }
  };

  return (
    <>
      {store.loading && <Loader.AbsoluteLinear />}
      {loading ? (
        <Loader.CenterProgress />
      ) : store.auth ? (
        <SuperAdmin />
      ) : (
        <UnAuth />
      )}
    </>
  );
}
