import { useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

const withAuth = (Component, allowedRoles = []) => {
    return function AuthWrapper(props) {
        const router = useRouter();

        useEffect(() => {
            const checkAuth = async () => {
                try {
                    // Only run on client side
                    if (typeof window === 'undefined') return;

                    const token = localStorage.getItem('token');
                    if (!token) {
                        router.replace('/login');
                        return;
                    }

                    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    const user = res.data;
                    if (!allowedRoles.includes(user.role)) {
                        router.replace("/unauthorized");
                    }

                } catch (err) {
                    console.error("Auth check failed:", err);
                    router.replace("/login");
                }
            };

            checkAuth();
        }, []);

        return <Component {...props} />;
    }
}

export default withAuth;
