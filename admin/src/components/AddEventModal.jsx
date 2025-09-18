import React, { useState, useEffect } from 'react';

const AddEventModal = ({ isOpen, onClose, onSubmit, initialData, loading }) => {
  const [eventData, setEventData] = useState({
    eventName: '',
    artistName: '',
    date: '',
    time: '',
    budget: '',
    location: '', 
    image: null,
    seats: [
      { section: 'Front', available: '', price: '' },
      { section: 'Middle', available: '', price: '' },
      { section: 'Back', available: '', price: '' }
    ]
  });

  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});


  useEffect(() => {
    if (initialData) {
      const formattedData = {
        ...initialData,
        date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : '',
        budget: initialData.budget ? initialData.budget.toString() : '',
        location: initialData.location || '', 
        seats: initialData.seats.map(seat => ({
          ...seat,
          available: seat.available.toString(),
          price: seat.price.toString()
        })),
        image: null 
      };
      setEventData(formattedData);

      if (initialData.image) {
        setPreview(initialData.image);
      }
    } else {
      resetForm();
    }
  }, [initialData]);

  const resetForm = () => {
    setEventData({
      eventName: '',
      artistName: '',
      date: '',
      time: '',
      budget: '',
      location: '',
      image: null,
      seats: [
        { section: 'Front', available: '', price: '' },
        { section: 'Middle', available: '', price: '' },
        { section: 'Back', available: '', price: '' }
      ]
    });
    setPreview(null);
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};

    if (!eventData.eventName.trim()) {
      newErrors.eventName = 'Event name is required';
    }

    if (!eventData.artistName.trim()) {
      newErrors.artistName = 'Artist name is required';
    }

    if (!eventData.date) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(eventData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = 'Event date cannot be in the past';
      }
    }

    if (!eventData.time) {
      newErrors.time = 'Time is required';
    }

    if (!eventData.budget || eventData.budget <= 0) {
      newErrors.budget = 'Budget must be greater than 0';
    }

    if (!eventData.location.trim()) {
      newErrors.location = 'Location is required'; 
    }


    eventData.seats.forEach((seat, idx) => {
      if (!seat.available || parseInt(seat.available) < 0) {
        newErrors[`seatAvailable${idx}`] = 'Available seats must be 0 or more';
      }
      if (!seat.price || parseFloat(seat.price) < 0) {
        newErrors[`seatPrice${idx}`] = 'Price must be 0 or more';
      }
    });

 
    if (!initialData && !eventData.image) {
      newErrors.image = 'Event image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: value }));

 
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSeatChange = (index, field, value) => {
    const newSeats = [...eventData.seats];
    newSeats[index][field] = value;
    setEventData(prev => ({ ...prev, seats: newSeats }));

    const errorKey = `seat${field.charAt(0).toUpperCase() + field.slice(1)}${index}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {

      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: 'Please select a valid image file' }));
        return;
      }


      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB' }));
        return;
      }

      setEventData(prev => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));

  
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: '' }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

   
    const submissionData = {
      ...eventData,
      budget: parseFloat(eventData.budget),
      seats: eventData.seats.map(seat => ({
        ...seat,
        available: parseInt(seat.available),
        price: parseFloat(seat.price)
      }))
    };

    try {
      await onSubmit(submissionData);
      resetForm();
    } catch (error) {

      console.error('Error submitting event:', error);
    }
  };

  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">
            {initialData ? 'Edit Event' : 'Add New Event'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
            disabled={loading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Event Name & Artist */}
          <div className="flex gap-4">
            <div className="flex-1 flex flex-col">
              <input 
                type="text"
                name="eventName"
                placeholder="Event Name"
                value={eventData.eventName}
                onChange={handleChange}
                className={`border px-3 py-2 rounded w-full ${errors.eventName ? 'border-red-500' : 'border-gray-300'}`}
                disabled={loading}
              />
              {errors.eventName && <span className="text-red-500 text-sm mt-1">{errors.eventName}</span>}
            </div>
            <div className="flex-1 flex flex-col">
              <input 
                type="text"
                name="artistName"
                placeholder="Artist Name"
                value={eventData.artistName}
                onChange={handleChange}
                className={`border px-3 py-2 rounded w-full ${errors.artistName ? 'border-red-500' : 'border-gray-300'}`}
                disabled={loading}
              />
              {errors.artistName && <span className="text-red-500 text-sm mt-1">{errors.artistName}</span>}
            </div>
          </div>

          {/* Date & Time */}
          <div className="flex gap-4">
            <div className="flex-1 flex flex-col">
              <input 
                type="date"
                name="date"
                value={eventData.date}
                onChange={handleChange}
                className={`border px-3 py-2 rounded w-full ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
                disabled={loading}
              />
              {errors.date && <span className="text-red-500 text-sm mt-1">{errors.date}</span>}
            </div>
            <div className="flex-1 flex flex-col">
              <input 
                type="time"
                name="time"
                value={eventData.time}
                onChange={handleChange}
                className={`border px-3 py-2 rounded w-full ${errors.time ? 'border-red-500' : 'border-gray-300'}`}
                disabled={loading}
              />
              {errors.time && <span className="text-red-500 text-sm mt-1">{errors.time}</span>}
            </div>
          </div>

          {/* Budget & Location */}
          <div className="flex gap-4">
            <div className="flex-1 flex flex-col">
              <input 
                type="number"
                name="budget"
                placeholder="Budget ($)"
                value={eventData.budget}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`border px-3 py-2 rounded w-full ${errors.budget ? 'border-red-500' : 'border-gray-300'}`}
                disabled={loading}
              />
              {errors.budget && <span className="text-red-500 text-sm mt-1">{errors.budget}</span>}
            </div>
            <div className="flex-1 flex flex-col">
              <input 
                type="text"
                name="location"
                placeholder="Location"
                value={eventData.location}
                onChange={handleChange}
                className={`border px-3 py-2 rounded w-full ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
                disabled={loading}
              />
              {errors.location && <span className="text-red-500 text-sm mt-1">{errors.location}</span>}
            </div>
          </div>

          {/* Image */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold">Event Image</label>
            <input 
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={`border px-3 py-2 rounded ${errors.image ? 'border-red-500' : 'border-gray-300'}`}
              disabled={loading}
            />
            {errors.image && <span className="text-red-500 text-sm">{errors.image}</span>}
            {preview && (
              <div className="mt-2">
                <img src={preview} alt="Preview" className="w-48 h-32 object-cover rounded border" />
                {initialData && !eventData.image && (
                  <p className="text-sm text-gray-600 mt-1">Current image (upload a new one to replace)</p>
                )}
              </div>
            )}
          </div>

          {/* Seats */}
          <div className="space-y-3">
            <h3 className="font-semibold">Seat Sections</h3>
            {eventData.seats.map((seat, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="w-20 pt-2">
                  <span className="font-medium text-sm">{seat.section}</span>
                </div>
                <div className="flex-1 flex flex-col">
                  <input 
                    type="number"
                    placeholder="Available Seats"
                    value={seat.available}
                    onChange={(e) => handleSeatChange(index, 'available', e.target.value)}
                    min="0"
                    className={`border px-3 py-2 rounded ${errors[`seatAvailable${index}`] ? 'border-red-500' : 'border-gray-300'}`}
                    disabled={loading}
                  />
                  {errors[`seatAvailable${index}`] && (
                    <span className="text-red-500 text-sm mt-1">{errors[`seatAvailable${index}`]}</span>
                  )}
                </div>
                <div className="flex-1 flex flex-col">
                  <input 
                    type="number"
                    placeholder="Price per Seat ($)"
                    value={seat.price}
                    onChange={(e) => handleSeatChange(index, 'price', e.target.value)}
                    min="0"
                    step="0.01"
                    className={`border px-3 py-2 rounded ${errors[`seatPrice${index}`] ? 'border-red-500' : 'border-gray-300'}`}
                    disabled={loading}
                  />
                  {errors[`seatPrice${index}`] && (
                    <span className="text-red-500 text-sm mt-1">{errors[`seatPrice${index}`]}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
            <button 
              type="button"
              onClick={handleClose}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500 disabled:opacity-50 flex items-center gap-2"
              disabled={loading}
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
              )}
              {loading 
                ? (initialData ? 'Updating...' : 'Creating...') 
                : (initialData ? 'Update Event' : 'Create Event')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal;