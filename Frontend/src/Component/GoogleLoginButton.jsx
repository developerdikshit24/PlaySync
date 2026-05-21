import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { googleLoginThunk } from '../store/authStore.js'
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
function GoogleLoginButton() {
    const dispatch = useDispatch();
    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <GoogleLogin

                onSuccess={credentialResponse => {
                    dispatch(googleLoginThunk(credentialResponse.credential))
                }}
                onError={() => {
                   toast.error('Login Failed');
                }}
                theme="outline"
                size="large"
                shape="circle"
                logo_alignment="left"
            />
        </GoogleOAuthProvider>

    );
}

export default GoogleLoginButton;
