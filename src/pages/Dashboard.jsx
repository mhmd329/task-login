import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInfo, logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      dispatch(fetchUserInfo());
    }
  }, [dispatch, token, navigate]);

  return (
    <div>
      <h2>مرحبًا، {user?.name || "مستخدم"}</h2>
      <button onClick={() => { dispatch(logout()); navigate("/login"); }}> log out</button>
    </div>
  );
};

export default Dashboard;
