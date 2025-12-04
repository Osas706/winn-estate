import React, { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Plus, Trash, UploadCloud } from "lucide-react";

const CreateListing = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountedPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  //console.log(files, formData);

  // handleImageSubmit func
  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);

      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });

          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed (2 mb per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };

  // storeImage func
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",

        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },

        (error) => {
          reject(error);
        },

        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  // handleRemoveImage func
  const handleRemoveImage = (index) => {
    setFormData({...formData, imageUrls: formData.imageUrls.filter((_, i) => i !== index),});
  };

  // handleChange func
  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({...formData, type: e.target.id,});
    }

    if (e.target.id === "parking" || e.target.id === "furnished" || e.target.id === "offer") {
      setFormData({...formData, [e.target.id]: e.target.checked,});
    }

    if (e.target.type === "number" || e.target.type === "text" || e.target.type === "textarea") {
      setFormData({...formData, [e.target.id]: e.target.value,});
    }
  };
 
  // handleSubmit func
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formData.imageUrls.length < 1) return setError("You must upload at least one image");
      if (+formData.regularPrice < +formData.discountedPrice) return setError("Discount price must be lower than regular price.");
      setLoading(true);
      setError(false);

      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });

      const data = await res.json();

      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }

      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  //*************template**************** */
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        {/********************1st frame*******************/}
        <div className="flex flex-col gap-4 flex-1 text-sm">
          <input
            type="text"
            className="border px-3 py-2 rounded-lg"
            placeholder="Name"
            id="name"
            maxLength={"62"}
            minLength={"10"}
            required
            onChange={handleChange}
            value={formData.name}
          />

          <textarea
            type="text"
            className="border px-3 py-2 rounded-lg resize-none"
            placeholder="Description"
            id="description"
            rows={7}
            required
            onChange={handleChange}
            value={formData.description}
          />

          <input
            type="text"
            className="border px-3 py-2 rounded-lg"
            placeholder="Address"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />

          {/***** checkbox *****/}
          <div className="flex gap-4 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-4"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span className="text-sm">Sell</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-4"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span className="text-sm">Rent</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-4"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span className="text-sm">Parking Spot</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-4"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span className="text-sm">Furnished</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-4"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span className="text-sm">Offer</span>
            </div>
          </div>

          {/****** space selection ******/}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min={"1"}
                max={"10"}
                required
                className="p-2 text-sm border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p className="text-sm">Beds</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min={"1"}
                max={"10"}
                required
                className="p-2 text-sm border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p className="text-sm">Baths</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min={"50"}
                max={"1000000"}
                required
                className="p-2 text-sm  border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.regularPrice}
              />

              <div className="flex flex-col items-center">
                <p className="text-sm font-medium">Regular Price</p>
                <span className="text-xs">(₦ / month)</span>
              </div>
            </div>

            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountedPrice"
                  min={"0"}
                  max={"100000"}
                  required
                  className="p-3 border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={formData.discountedPrice}
                />

                <div className="flex flex-col items-center">
                  <p>Discounted Price</p>
                  <span className="text-xs">($ / month)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/********************2nd frame*******************/}
        <div className="flex-col flex flex-1 gap-4">
          <p className="font-semibold text-sm">
            Images:
            <span className="font-normal text-gray-400 ml-2">
              The first image wil be the cover (max 6)
            </span>
          </p>

          <div className="flex items-center gap-4">
            <input
              type="file"
              id="iamges"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(e.target.files)}
              className="p-0 bg-slate-500 text-slate-200 border border-gray-400 rounded w-full "
            />

            <button
              onClick={handleImageSubmit}
              type="button"
              disabled={uploading}
              className="p-1.5 text-sm flex items-center gap-1 text-green-700 border border-green-700 rounded  hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"} <UploadCloud className="w-4 h-4" />
            </button>
          </div>

          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>

          {/****************listing data*****************/}
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between px-3 py-2 border items-center bg-slate-400 rounded-md border border-slate-500"
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-20 h-20 object-contain rounded-lg"
                />

                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                >
                  <Trash className="text-red-700 fill-red-200 w-5 h-5" />
                </button>
              </div>
            ))}

          <button
            disabled={loading || uploading}
            className="px-3 py-2 bg-slate-700 text-white rounded-lg flex gap-1 items-center justify-center hover:opacity-95 disabled:opacity-80"
          > 
            {loading ? "Creating..." : "Create Listing"} <Plus className="w-6 h-6" />
          </button>

          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
