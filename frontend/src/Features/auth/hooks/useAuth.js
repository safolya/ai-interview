/* eslint-disable no-unused-vars */
import { useContext,useEffect,useState } from "react";
import { AuthContext } from "../auth.context";
import { login, logout, get_me, register } from "../services/auth.api";

export const useAuth = () => {
    const context = useContext(AuthContext);
    const { user, setUser, loading, setLoading } = context;
    const [authLoading, setAuthLoading] = useState(true);

    const handleLogin = async ({ email, password }) => {
        setLoading(true);
        try {
            const data = await login({ email, password });
            setUser(data.user);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }

    }

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true);
        try {
            const data = await register({ username, email, password });
            setUser(data.user);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }

    }

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout();
            setUser(null);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }

    }

    //   useEffect(()=>{
    //      const getUser=async()=>{
    //         try {
    //              const data=await get_me();
    //         setUser(data.user);
    //         } catch (error) {
    //             console.log(error);
    //         }finally{
    //             setLoading(false);
    //         }
    //     }
    //      getUser();
    //  },[])

    useEffect(() => {
    const getUser = async () => {
        try {
            const data = await get_me();
            setUser(data.user);
        } catch (error) {
            setUser(null);
        } finally {
            setAuthLoading(false); // ✅ IMPORTANT
        }
    };

    getUser();
}, []);

    return { user, loading, authLoading, handleLogin, handleLogout, handleRegister }

}
