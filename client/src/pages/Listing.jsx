import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { Navigation } from 'swiper/modules'
import 'swiper/css/bundle'
import { FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking } from 'react-icons/fa'
import { useSelector } from 'react-redux';
import Contact from '../components/Contact';


export default function Listing() {
    SwiperCore.use([Navigation]);
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const params = useParams();
    const {currentUser} = useSelector((state) => state.user);
    const [contact, setContact] = useState(false);


    useEffect(() => {
        const fetchListing = async () => {
            try{
                const res = await fetch(`/api/listing/get/${params.listingId}`)
                const data = await res.json()

                if(data.success === false) {
                    setError(true);
                    setLoading(false);
                }

                setListing(data);
                setLoading(false);
            } catch (error) {
                setError(error)
                setLoading(false)
            }
        };
        fetchListing();
    }, [params.listingId]);

  return (
    <main>
        {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}

        {error && <p className='text-center my-7 text-2xl'>Error fetching listing</p>}

        {listing && !loading && !error && (
            <> 
                <div>
                    <Swiper navigation>
                        {listing.imageUrls.map((url) => (
                            <SwiperSlide key={url}>
                                <div className="h-[600px]" style={{background: `url(${url}) center no-repeat`, backgroundSize: 'cover'}}></div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <div className="p-3 max-w-7xl mx-auto">
                
                    <p className='flex items-center mt-6 gap-2 font-semibold text-2xl'>
                        <span>{listing.name}</span> 
                        {listing.regularPrice && <span className='text-red-500 line-through'>${listing.regularPrice}</span>} - 
                        <span className='text-green-500'>${listing.discountedPrice}</span>

                        {listing.type === 'rent' && ' / month'}
                    </p>

                    <p className='flex items-center mt-6 gap-2 text-slate-600 my-2 text-sm'>
                        <FaMapMarkerAlt className='text-green-700' />
                        {listing.address}
                    </p>

                    <div className="flex gap-4">
                        <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-lg'>
                            {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                        </p>

                        {listing.offer && (
                            <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-lg'>${+listing.regularPrice - +listing.discountedPrice} OFF</p>
                        )} 
                    </div>
                    
                    <p className='text-slate-800 pt-3'>
                        <span className='font-semibold text-black'> Desciption - {' '}</span>
                        {listing.description}
                    </p>

                    <ul className='text-green-900 my-5 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
                        <li className='py-3 flex items-center gap-1 whitespace-nowrap '>
                            <FaBed className='text-lg' />
                            <span className='font-semibold text-black'>Bedrooms - {' '}</span>
                            {listing.bedrooms}
                        </li>

                        <li className='py-3 flex items-center gap-1 whitespace-nowrap '>
                            <FaBath className='text-lg' />
                            <span className='font-semibold text-black'>Bathrooms - {' '}</span>
                            {listing.bathrooms}
                        </li>

                        <li className='py-3 flex items-center gap-1 whitespace-nowrap '>
                            <FaParking className='text-lg' />
                            <span className='font-semibold text-black'>Parking - {' '}</span>
                            {listing.parking ? 'Available' : 'No Parking'}
                        </li>

                        <li className='py-3 flex items-center gap-1 whitespace-nowrap '>
                            <FaChair className='text-lg' />
                            <span className='font-semibold text-black'>Furnished - {' '}</span>
                            {listing.furnished ? 'Furnished' : 'Not Furnished'}
                        </li>

                        <li className='py-3 flex items-center gap-1 whitespace-nowrap '>
                            <FaBath className='text-lg' />
                            <span className='font-semibold text-black'>Bathrooms - {' '}</span>
                            {listing.bathrooms}
                        </li>   
                    </ul>


                    {currentUser && listing.userRef !== currentUser._id && !contact && (
                    <div className="flex gap-4">
                        <button onClick={() => setContact(true)} className='bg-slate-900 text-white p-2 rounded-lg w-full'>Contact Landlord</button>
                        <button className='bg-slate-900 text-white p-2 rounded-lg w-full'>Book Viewing</button>
                    </div>

                    )}

                    {contact && (
                        <Contact listing={listing} />
                    )}

                </div>
            
            </>
        )}


    </main>
  )
}
