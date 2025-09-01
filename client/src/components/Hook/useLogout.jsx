import { useContext, useState } from 'react';
import { useNavigate } from "react-router";
import { AuthContext } from '../context/AuthProvider';
const useLogout = () => {
	const [loading, setLoading] = useState(false);
	const { setAuthUser } = useContext(AuthContext);
	const router = useNavigate();

	const logout = async () => {
		setLoading(true);
		try {
			localStorage.removeItem("userId");
			setAuthUser(null);

		} catch (error) {
			console.error("Logout error:", error);
		} finally {
			setLoading(false);
			router.push('/login');
		}
	};

	return { loading, logout };
};

export default useLogout;
