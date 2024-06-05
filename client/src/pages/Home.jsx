import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules'
import ListingItem from '../components/ListingItem';


const Home = () => {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);
  


  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const response = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await response.json();
        setOfferListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const response = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await response.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    }

    const fetchRentListings = async () => {
      try {
        const response = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await response.json();
        setRentListings(data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchOfferListings();
    fetchSaleListings();
    fetchRentListings();
  
  }, []);

  return (
    <div>
      {/* Top Page */}
      
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Find your next <span className='text-slate-500'>Perfect</span><br/> Home with us
        </h1>

        <div className="text-gray-400 text-xl sm:text-sm">
          Kriss Estate is the the best place to find your dream home fast, easy and stress free.<br/>
          We have a wide range of properties available for sale and rent. Our properties are affordable and we have a team of professionals ready to help you find the perfect home.
        </div>

        <div className="">
          <Link to={`/search`} className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'>
            Let's get started...
          </Link>
        </div>
      </div>

      {/* Swiper */}
      <Swiper navigation>
        {
          offerListings && offerListings.length > 0 && offerListings.map((listing) => (
            <SwiperSlide>
              <div style={{background: `url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize:"cover"}} className="h-[500px] " key={listing._id}></div>
            </SwiperSlide>
          ))
        }
      </Swiper>

      {/* Listings results for offer sales and rent */}
        
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 && (
            <div className="">
                <div className="my-3">
                  <h2 className='text-2xl font-semibold text-slate-700'>Recent Offers</h2>
                  <Link className="text-sm text-blue-800 hover:underline" to={'/search?offer=true'}>
                    Show more Offers
                  </Link>
                </div>

                <div className="flex flex-wrap gap-4">
                  {
                    offerListings.map((listing) => (
                      <ListingItem listing={listing} key={listing._id}/>
                    ))
                  }
                </div>
            </div>
          )
        }

        
      {saleListings && saleListings.length > 0 && (
              <div className="">
                <div className="my-3">
                  <h2 className='text-2xl font-semibold text-slate-700'>Recent Places For Sale</h2>
                  <Link className="text-sm text-blue-800 hover:underline" to={'/search?type=sale'}>
                    Show more places for sale
                  </Link>
                </div>

                <div className="flex flex-wrap gap-4">
                  {
                    saleListings.map((listing) => (
                      <ListingItem listing={listing} key={listing._id}/>
                    ))
                  }
                </div>
            </div>
          )
        }

           
      {rentListings && rentListings.length > 0 && (
              <div className="">
                <div className="my-3">
                  <h2 className='text-2xl font-semibold text-slate-700'>Recent Places For Rent</h2>
                  <Link className="text-sm text-blue-800 hover:underline" to={'/search?type=rent'}>
                    Show more places for rent
                  </Link>
                </div>

                <div className="flex flex-wrap gap-4">
                  {
                    rentListings.map((listing) => (
                      <ListingItem listing={listing} key={listing._id}/>
                    ))
                  }
                </div>
            </div>
          )
        }


        

        

        
      </div>



    </div>
  )
}

export default Home