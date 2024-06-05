import React from 'react'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, provider);
            
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: result.user.displayName, email: result.user.email, photo: result.user.photoURL})
            });
            const data = await res.json();
            dispatch(signInSuccess(data));
            navigate('/');
        }
        catch (error) {
            console.log("Can not Sign In with Google");
        }
    }
  return (
    <button onClick={handleGoogleClick} type='button' className='bg-white text-slate-700 p-3 rouded-lg uppercase hover:opacity-95'><i class="bi bi-google mr-5"></i>Continue with Google</button>
  )
}
