import toast from "react-hot-toast";
import { endPoints } from "../api";
import { setAuthentication, setLoading, setUser } from "../../redux/reducers/slice/auth";
import axios from "axios";

const {
    LOGOUT_API,
    LOGIN_API,
    REGISTER_API,
    GET_MY_PROFILE_API,
} = endPoints;

export const logout = () => {
    return async (dispatch) => {
        const toastId = toast.loading('Loading...');
        dispatch(setLoading(true));
        await axios.post(LOGOUT_API, {}, { withCredentials: true })
            .then((res) => {
                // console.log(res);
                dispatch(setUser(null));
                dispatch(setAuthentication(false));
                localStorage.clear();
                toast.success(res.data?.message);
            })
            .catch((error) => {
                console.log("ERROR OCCURRED WHILE LOGOUT--", error);
                toast.success(error?.response?.data?.message);
            });
        toast.dismiss(toastId);
        dispatch(setLoading(false));
    }
}

export const getMyProfile = () => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        await axios.get(
            GET_MY_PROFILE_API,
            { withCredentials: true }
        )
            .then((res) => {
                // console.log(res.data);
                dispatch(setUser(res.data?.data));
                localStorage.setItem('user', JSON.stringify(res.data?.data));
            })
            .catch((error) => {
                // console.log(error.response);
                localStorage.setItem('auth', JSON.stringify(false));
                dispatch(setAuthentication(false));
                toast.error(
                    error?.response?.data?.message,
                    {
                        duration: 1500,
                        position: "bottom-center",
                    }
                );
            })
        dispatch(setLoading(false));
    }
}