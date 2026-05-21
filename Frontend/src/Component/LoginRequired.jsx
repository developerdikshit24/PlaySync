import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginRequired = () => {
    const navigate = useNavigate();

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const handleRedirectBack = () => {
        navigate('/');
    };
    const handleRedirectLogin = () => {
        navigate('/login');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-300/50 bg-opacity-70">
            <div className="bg-base-100 p-10 rounded-lg shadow-xl w-[90%] max-w-md text-center">
                <h2 className="text-xl font-bold mb-4">Login Required</h2>
                <p className="mb-6">You must be logged in to access this page.</p>
                <div className='flex gap-4 justify-center w-full p-2'>
                    <button
                        onClick={handleRedirectBack}
                        className="btn btn-outline "
                    >
                        Back
                    </button>
                    <button
                        onClick={handleRedirectLogin}
                        className="btn btn-primary"
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginRequired;
