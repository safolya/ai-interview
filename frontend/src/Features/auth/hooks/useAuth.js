/* eslint-disable no-unused-vars */
import { useContext,useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, logout, get_me, register } from "../services/auth.api";

export const useAuth = () => {
    const context = useContext(AuthContext);
    const { user, setUser, loading, setLoading } = context;

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

      useEffect(()=>{
         const getUser=async()=>{
            try {
                 const data=await get_me();
            setUser(data.user);
            } catch (error) {
                console.log(error);
            }finally{
                setLoading(false);
            }
        }
         getUser();
     },[])

    return { user, loading, handleLogin, handleLogout, handleRegister }

}
