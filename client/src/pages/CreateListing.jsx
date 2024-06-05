import { useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../firebase';
import {useSelector} from 'react-redux';   
import {useNavigate} from 'react-router-dom'; 

export default function CreateListing() {
    const {currentUser} = useSelector(state => state.user);
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const [FormData, setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountedPrice: 50,
        offer: false,
        sqft: 25,
        furnished: false,
        type: 'rent',
        parking: false,
    });

    const [uploading, setUploading] = useState(false);
    const [imageUploadError, setImageUploadError] = useState(false);
    console.log(FormData);
    
    const handleSubmitImage = async () => {
        if (files.length > 0 && files.length + FormData.imageUrls.length < 7) {
            setUploading(true);
            
            const promises = [];

            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }

            Promise.all(promises).then((urls) => {
                setFormData({...FormData, imageUrls: FormData.imageUrls.concat(urls)});
                setImageUploadError(false);
                setUploading(false);
            }).catch((error) => {
                setImageUploadError('Image upload failed. Please try again.');
                setUploading(false);
            });
        }   
        else {
            setImageUploadError('You can only upload up to 6 images.');
            setUploading(false);
        }
    };

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log('File available at', downloadURL);
                        resolve(downloadURL);
                    });
                });
        });
    }

    const handleRemoveImage = (index) => {
        setFormData({
            ...FormData,
            imageUrls: FormData.imageUrls.filter((_, i) => i !== index),
        
        })
    }

    const handleChange = (e) => {
        if(e.target.id === 'sale' || e.target.id === 'rent') {
            setFormData({
                ...FormData, 
                type: e.target.id
            });
        }

        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setFormData({
                ...FormData,
                [e.target.id]: e.target.checked
            });
        }

        if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
            setFormData({
                ...FormData,
                [e.target.id]: e.target.value
            });
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
            
        try {
            if(FormData.imageUrls.length < 1)  return setError('Please upload at least one image.');
            if (+FormData.regularPrice < +FormData.discountedPrice) return setError('Discounted price must be less than regular price.');
            setLoading(true);
            setError(false);

            const res = await fetch('/api/listing/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...FormData,
                    userRef: currentUser._id
                }),
            });
            const data = await res.json();
            setLoading(false);
            if (data.success == false) {
                setError(data.message);
            }
            navigate(`/listing/${data.listing._id}`);

        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    }


  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>

        <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
            <div className="flex flex-col gap-4 flex-1 ">
                <input onChange={handleChange} value={FormData.name} type="text" placeholder='Name' className='border p-3 rounded-lg' id='name' maxLength="62" required/>
                <textarea onChange={handleChange} value={FormData.description} type="text" placeholder='Description' className='border p-3 rounded-lg' id='description' required/>
                <input onChange={handleChange} value={FormData.address} type="text" placeholder='Address' className='border p-3 rounded-lg' id='address' required/>
                
                <div className="flex gap-6 flex-wrap">
                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={FormData.type === 'sale'} type="checkbox" id='sale'  className='w-5'/>
                        <span>Sell</span>
                    </div>

                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={FormData.type === 'rent'} type="checkbox" id='rent' className='w-5'/>
                        <span>Rent</span>
                    </div>

                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={FormData.parking} type="checkbox" id='parking' className='w-5'/>
                        <span>Parking Spot</span>
                    </div>

                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={FormData.furnished} type="checkbox" id='furnished' className='w-5'/>
                        <span>Furnished</span>
                    </div>

                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={FormData.offer} type="checkbox" id='offer' className='w-5'/>
                        <span>Offer</span>
                    </div>

                </div>

                <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-2">
                        <input onChange={handleChange} value={FormData.bedrooms} type="number" id='bedrooms' min="1" max="50" required className='p-3 border border-gray-300 rounded-lg'/>
                        <p>Beds</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <input onChange={handleChange} value={FormData.bathrooms} type="number" id='bathrooms' min="1" max="50" required className='p-3 border border-gray-300 rounded-lg'/>
                        <p>Baths</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <input onChange={handleChange} value={FormData.sqft} type="number" id='sqft' required className='p-3 border border-gray-300 rounded-lg'/>
                        <div className="flex flex-col items-center">
                            <p>Square Root</p>
                            <span className='text-xs'>(m2)</span>
                        </div>
                    </div>


                    <div className="flex items-center gap-2">
                        <input onChange={handleChange} min='50' max='10000' value={FormData.regularPrice} type="number" id='regularPrice' required className='p-3 border border-gray-300 rounded-lg'/>
                        <div className="flex flex-col items-center">
                            <p>Regular Price</p>
                            <span className='text-xs'>($ / months)</span>
                        </div>
                    </div>

                    {FormData.offer &&
                        (
                        <div className="flex items-center gap-2">
                            <input onChange={handleChange} value={FormData.discountedPrice} min='50' max='10000' type="number" id='discountedPrice' required className='p-3 border border-gray-300 rounded-lg'/>
                            <div className="flex flex-col items-center">
                                <p>Discounted Price</p>
                                <span className='text-xs'>($ / months)</span>
                            </div>
                        </div>
                        )
                    }
                </div>

                <div className="flex flex-col flex-1 gap-4">
                    <p className='font-semibold'>Images: 
                        <span className='font-normal text-gray-600 ml-2'>The first image will be cover (max 6)</span>
                    </p>

                    <div className="flex gap-4">
                        <input onChange={(e) => setFiles(e.target.files) }  className='p-3 border border-gray-300 rounded w-full' type="file" id='images' accept='image/*' multiple />
                        <button type='button' onClick={handleSubmitImage} className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80' >
                            {uploading ? 'Uploading...' : 'Upload'}
                        </button>
                    </div>
                </div>

                <p className='text-red-700'>{imageUploadError && imageUploadError} </p>
                
                {FormData.imageUrls.length > 0 && FormData.imageUrls.map((url, index) => (
                        <div key={url} className="flex justify-between p-3 border items-center">
                            <img src={url} alt="listing-img" className='w-40 h-40 object-contain rounded-lg' />
                            <button type="button" onClick={() => handleRemoveImage(index)} className='p-3 text-red-700 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
                                Delete
                            </button>
                        </div>
                    ))
                }

                <button disabled={loading || uploading} className='p-3 bg-slate-800 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Creating..': 'Create Listing'} </button>

                {error && <p className='text-red-700 text-sm'>{error}</p> }
            </div>
            
        </form>

    </main>
  )
}
 