import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import Actions from "../redux/actions";
import Loader from "../components/Loader";

import UnAuth from "../pages/UnAuth";
import SuperAdmin from "../pages/SuperAdmin";
import Admin from "../pages/Admin";

export default function Main() {
  const store = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    dispatch(Actions.auth.checkLogin()).then(() => {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    });
    // eslint-disable-next-line
  }, []);

  return (
    <>
    <Admin />
      {/* {store.loading && <Loader.AbsoluteLinear />}
      {loading ? (
        <Loader.CenterProgress />s
      ) : store.auth ? (
        store.user.role === "SUPERADMIN" ? (
          <SuperAdmin />
        ) : (
          <Admin />
        )
      ) : (
        <UnAuth />
      )} */}
    </>
  );
}
