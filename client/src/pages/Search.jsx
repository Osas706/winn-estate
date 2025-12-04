import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingCard from '../features/ListingCard';
import { SearchIcon } from 'lucide-react';

const Search = () => {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  });
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (searchTermFromUrl || typeFromUrl || parkingFromUrl || furnishedFromUrl || offerFromUrl || sortFromUrl || orderFromUrl) {
      setSidebarData({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true' ? true : false,
        furnished: furnishedFromUrl === 'true' ? true : false,
        offer: offerFromUrl === 'true' ? true : false,
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    };

    // fetchListings function
    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);

      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();

      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }

      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  // handleChange function
  const handleChange = (e) => {
    if (e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
      setSidebarData({ ...sidebarData, type: e.target.id });
    };

    if (e.target.id === 'searchTerm') {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    };

    if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
      setSidebarData({
        ...sidebarData,
        [e.target.id]:
          e.target.checked || e.target.checked === 'true' ? true : false,
      });
    };

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at';

      const order = e.target.value.split('_')[1] || 'desc';

      setSidebarData({ ...sidebarData, sort, order });
    };
  };

  // handleSubmit function
  const handleSubmit = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams();

    urlParams.set('searchTerm', sidebarData.searchTerm);
    urlParams.set('type', sidebarData.type);
    urlParams.set('parking', sidebarData.parking);
    urlParams.set('furnished', sidebarData.furnished);
    urlParams.set('offer', sidebarData.offer);
    urlParams.set('sort', sidebarData.sort);
    urlParams.set('order', sidebarData.order);

    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

// onShowMoreClick function
  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();

    if (data.length < 9) {
      setShowMore(false);
    };

    setListings([...listings, ...data]);
  };


  return (
    <div className='flex flex-col md:flex-row md:mb-[-40px]'>
      <div className='p-7 border-b-2 md:border-r-2'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div className='flex items-center gap-2'>
            <label className="whitespace-nowrap font-semibold text-sm">Search Term:</label>

            <input
              type="text"
              id='searchTerm'
              placeholder='Search...'
              className='border rounded-lg py-1.5 px-3 w-full'
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>

          {/* *** Type *** */}
          <div className='flex gap-3 flex-wrap items-center'>
            <label className='font-semibold text-sm'>Type:</label>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id='all'
                className='w-4'
                onChange={handleChange}
                checked={sidebarData.type === 'all'}
              />
              <span className='text-sm'>Rent & Sale</span>
            </div>

            {/* rent */}
            <div className="flex gap-2">
              <input
                type="checkbox"
                id='rent'
                className='w-4'
                onChange={handleChange}
                checked={sidebarData.type === 'rent'}
              />
              <span className='text-sm'>Rent</span>
            </div>

            {/* sale */}
            <div className="flex gap-2">
              <input
                type="checkbox"
                id='sale'
                className='w-4'
                onChange={handleChange}
                checked={sidebarData.type === 'sale'}
              />
              <span className='text-sm'>Sale</span>
            </div>

            {/* offer */}
            <div className="flex gap-2">
              <input
                type="checkbox"
                id='offer'
                className='w-4'
                onChange={handleChange}
                checked={sidebarData.offer}
              />
              <span className='text-sm'>Offer</span>
            </div>
          </div>

          {/* *** Amenities *** */}
          <div className='flex gap-3 flex-wrap items-center'>
            <label className='font-semibold text-sm'>Amenities:</label>

            {/* parking */}
            <div className="flex gap-2">
              <input
                type="checkbox"
                id='parking'
                className='w-4'
                onChange={handleChange}
                checked={sidebarData.parking}
              />
              <span className='text-sm'>Parking</span>
            </div>

            {/* furnished */}
            <div className="flex gap-2">
              <input
                type="checkbox"
                id='furnished'
                className='w-4'
                onChange={handleChange}
                checked={sidebarData.furnished}
              />
              <span className='text-sm'>Furnished</span>
            </div>
          </div>

          {/* sort_order  */}
          <div className='flex items-center gap-3'>
            <label className='font-semibold text-sm'>Sort:</label>
            <select
              onChange={handleChange}
              defaultValue={'created_at_desc'}
              id='sort_order'
              className='border rounded-lg py-2 text-sm'
            >
              <option value='regularPrice_desc'>Price high to low</option>
              <option value='regularPrice_asc'>Price low to hight</option>
              <option value='createdAt_desc'>Latest</option>
              <option value='createdAt_asc'>Oldest</option>
            </select>
          </div>

          <button className='bg-slate-700 flex items-center justify-center gap-1 text-white px-5 py-2 rounded-lg  hover:opacity-95'>
            Search <SearchIcon className='w-4 h-4' />
          </button>
        </form>
      </div>

      {/* search grid display */}
      <div className='flex-1'>
        <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>
          Listing results
        </h1>

        <div className="p-7 flex flex-wrap gap-4">
          {!loading && listings.length === 0 && (
            <p className='text-xl text-slate-700'>No listing found!</p>
          )}

          {loading && (
            <p className='text-xl text-slate-700 text-center w-full'>Loading...</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {!loading && listings && listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>

          {showMore && (
            <button
              onClick={onShowMoreClick}
              className='text-green-700 hover:underline p-7 text-center w-full'
            >
              Show more
            </button>
          )}
        </div>

      </div>
    </div>
  )
}

export default Search;
