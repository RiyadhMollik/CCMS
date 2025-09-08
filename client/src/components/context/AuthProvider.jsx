import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const useAuthContext = () => {
    return useContext(AuthContext);
};
export const AuthContextProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [isslider, setIsslider] = useState(false);
    const [rolePermission, setRolePermission] = useState({});

    useEffect(() => {
        const fetchUserData = async (userId) => {
            setLoadingUser(true);
            try {
                const response = await fetch(`https://iinms.brri.gov.bd/api/users/${userId}`);
                if (response.ok) {
                    const userData = await response.json();
                    console.log(userData);
                    const res = await fetch(
                        `https://iinms.brri.gov.bd/api/roles/roles/${userData.roleId}/permissions`
                    );
                    if (res.ok) {
                        const data = await res.json();
                        const convertPermissions = (permissionsArray) => {
                            if (!permissionsArray || permissionsArray.length === 0) return {};
                            const permissions = permissionsArray.reduce((acc, item) => {
                                acc[item.permission] = item.isGranted;
                                return acc;
                            }, {});

                            return { permissions };
                        };
                        const result = convertPermissions(data);
                        console.log(result.permissions);
                        setRolePermission(result.permissions);
                    }
                    setAuthUser(userData);
                } else {
                    console.error("Failed to fetch user data");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoadingUser(false);
            }
        };

        try {
            const userIdString = localStorage.getItem('userId');
            if (userIdString) {
                const userId = JSON.parse(userIdString);
                if (userId) {
                    fetchUserData(userId);
                } else {
                    console.warn('userId is null or undefined');
                    setLoadingUser(false);
                }
            } else {
                console.warn('No userId found in localStorage');
                setLoadingUser(false);
            }
        } catch (error) {
            console.error('Error parsing userId from localStorage:', error);
            setLoadingUser(false);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ authUser,rolePermission, setAuthUser, loadingUser, isslider, setIsslider }}>
            {children}
        </AuthContext.Provider>
    );
};
