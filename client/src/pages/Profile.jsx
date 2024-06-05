import {useRef, useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { upDateUserStart, upDateUserSuccess, upDateUserFail,
         deleteUserStart, deleteUserSuccess, deleteUserFail,
         signOutStart, signOutSuccess, signOutFail
        } from '../redux/user/userSlice'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

const Profile = () => {
  const {currentUser} = useSelector(state => state.user)
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePercent, setFilePercent] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();
 
  // console.log(formData);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setFilePercent(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },

      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({...formData, photo: downloadURL});
        });
      });
  }

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
  }

  const handleSubmit =  async (e) => {
    e.preventDefault();
    try {
      dispatch(upDateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      }); 
      const data = await res.json();
      if (data.error) {
        dispatch(upDateUserFail(data.error));
        return;
      }
      dispatch(upDateUserSuccess(data));

    } catch (error) {
      dispatch(upDateUserFail(error.message));
    }
  }

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {method: 'DELETE'});
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFail(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));

    } catch (error) {
      dispatch(deleteUserFail(error.message));
    }
  }

  const handleSignOut = async () => {
    try {
      dispatch(signOutStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutFail(data.message));
        return;
      }
      dispatch(signOutSuccess(data));
      
    } catch (error) {
      dispatch(signOutFail(error.message));
    }
  }

  const handleShowLisitings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      
      if(data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);

    } catch (error) {
      setShowListingsError(true);
    }
    
  }

  const handleDeleteListing = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {method: 'DELETE'});
      const data = await res.json();

      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId))
    } catch (error) {
      console.log(error.message);
    }

  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

        <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/.*'/>
        <img onClick={() => fileRef.current.click()} src={formData.photo || currentUser.photo} alt="profile" className='rounded-full h-24 2-24 object-cover cursor-pointer self-center mt-2' />

        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className="text-red-700">Upload Failed</span>
            ):
            filePercent > 0 && filePercent < 100 ? (
              <span className="text-slate-700">Uploading {filePercent}%</span>
            ) : filePercent === 100 ? (
              <span className="text-green-700">Upload Successful</span>
            ) : (
              ''
            )}
        </p>

        <input type="text" placeholder="Username" defaultValue={currentUser.username} 
        onChange={handleChange} id='username' className='border p-3 rounded-lg' />

        <input type="text" placeholder="Email" defaultValue={currentUser.email}
        onChange={handleChange} id='email' className='border p-3 rounded-lg' />

        <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>Update</button>
        <Link className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-955' to={'/create-listing'}>
          Create Listing
        </Link>
      </form>

      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete Account?</span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>

      {/* <p className='text-red-700 mt-5'>{Error ? Error : ''}</p>
      <p className='text-green-700 mt-5'>
        {upDateUserSuccess ? 'User updated successfully' : ''}
      </p>
      */}

      <button onClick={handleShowLisitings} className='text-green-700 w-full mt-10'>Show Listings</button>
      <p className='text-red-700 mt-5'>
        {showListingsError ? 'Failed to load listings' : ''}
      </p>

      {userListings && userListings.length > 0 && 
      <div className='flex flex-col gap-4'>
        <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listing</h1>
      
      {userListings.map((listing, index) => (

    
          <div key={listing._id} className='border rounded-lg p-3 flex justify-between items-center gap-4'>
            <Link to={`/listing/${listing._id}`}>
              <img src={listing.imageUrls[0]} alt="listing cover" className='h-16 w-16 object-contain '/>
    
            </Link>

            <Link className='text-slate-700 flex-1 font-semibold hover:underline truncate' to={`/listing/${listing._id}`}>
              <p>{listing.name} </p>
            </Link>

            <div className="flex flex-col items-center">
              <button onClick={() => handleDeleteListing(listing._id)}  className='text-red-700 uppercase'>Delete</button>
              <Link to={`/update-listing/${listing._id}`}>
                <button className='text-green-700 uppercase'>Edit</button>
              </Link>
            </div>

          </div>

      ))}
      </div>}

    </div>
  )
}

export default Profile