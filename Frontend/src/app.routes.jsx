import { createBrowserRouter, Outlet } from 'react-router';

import Navbar from './features/common/components/Navbar';
import Footer from './features/common/components/footer';
import Front from './features/common/components/Front';
import { useAuth } from './features/auth/hooks/useAuth';
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import Protected from './features/auth/components/protected';
import Home from './features/interview/pages/Home';
import Interview from "./features/interview/pages/Interview"
import Loader from './features/common/components/Loader';

function LandingRoute() {
    const { user, loading } = useAuth();

    if (loading) {
        return <main ><Loader/></main>;
    }

    return user ? <Home /> : <Front />;
}

function AppLayout() {
    const { user, loading } = useAuth();

    return (
        <>
            <Navbar />
            <Outlet />
            {!loading && !user && <Footer />}
        </>
    );
}

export const router = createBrowserRouter([
    {
        element: <AppLayout />,
        children: [
            {
                path: "/",
                element: <LandingRoute />
            },
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/register",
                element: <Register />
            },
            {
                path: "/interview/:interviewId",
                element: <Protected><Interview /></Protected>
            }
        ]
    }
]);

