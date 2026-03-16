"use client"

import React from 'react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface AddressFormProps {
  formData: {
    name: string;
    email?: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    landmark?: string;
  };
  onChange: (data: any) => void;
  errors?: Record<string, string>;
}

export const AddressForm: React.FC<AddressFormProps> = ({ formData, onChange, errors }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    onChange({ ...formData, [name]: value })
  }

  const inputClasses = (error?: string) => cn(
    "mt-1.5 block w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-medium text-white transition-all duration-300 backdrop-blur-sm",
    "placeholder:text-slate-500 focus:outline-none focus:border-saffron/50 focus:ring-4 focus:ring-saffron/10 focus:bg-white/10",
    error && "border-red-500/50 focus:border-red-500 focus:ring-red-500/10 bg-red-500/5"
  );

  const labelClasses = "block text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 ml-1 mb-1";

  return (
    <div className="space-y-6">
      {/* Name & Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClasses}>Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="e.g. Rahul Sharma"
            value={formData.name}
            onChange={handleChange}
            className={inputClasses(errors?.name)}
          />
          {errors?.name && <p className="mt-1.5 text-[10px] font-bold text-red-500 ml-1 uppercase tracking-tight">{errors.name}</p>}
        </div>
        <div>
          <label className={labelClasses}>Phone Number</label>
          <input
            type="text"
            name="phone"
            placeholder="+1 234 567 890"
            value={formData.phone}
            onChange={handleChange}
            className={inputClasses(errors?.phone)}
          />
          {errors?.phone && <p className="mt-1.5 text-[10px] font-bold text-red-500 ml-1 uppercase tracking-tight">{errors.phone}</p>}
        </div>
      </div>

      {/* Email */}
      <div>
        <label className={labelClasses}>Email Address <span style={{color: '#FF9933'}}>(for order confirmation)</span></label>
        <input
          type="email"
          name="email"
          placeholder="you@example.com"
          value={formData.email || ""}
          onChange={handleChange}
          className={inputClasses(errors?.email)}
        />
        {errors?.email && <p className="mt-1.5 text-[10px] font-bold text-red-500 ml-1 uppercase tracking-tight">{errors.email}</p>}
      </div>

      {/* Address Lines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClasses}>Address Line 1</label>
          <input
            type="text"
            name="line1"
            placeholder="Street address, P.O. box"
            value={formData.line1}
            onChange={handleChange}
            className={inputClasses(errors?.line1)}
          />
          {errors?.line1 && <p className="mt-1.5 text-[10px] font-bold text-red-500 ml-1 uppercase tracking-tight">{errors.line1}</p>}
        </div>
        <div>
          <label className={labelClasses}>Floor / Suite (Optional)</label>
          <input
            type="text"
            name="line2"
            placeholder="Apt, Suite, Unit, etc."
            value={formData.line2}
            onChange={handleChange}
            className={inputClasses()}
          />
        </div>
      </div>

      {/* City, State, Zip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className={labelClasses}>City</label>
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className={inputClasses(errors?.city)}
          />
          {errors?.city && <p className="mt-1.5 text-[10px] font-bold text-red-500 ml-1 uppercase tracking-tight">{errors.city}</p>}
        </div>
        <div>
          <label className={labelClasses}>State</label>
          <input
            type="text"
            name="state"
            placeholder="State / Province"
            value={formData.state}
            onChange={handleChange}
            className={inputClasses(errors?.state)}
          />
          {errors?.state && <p className="mt-1.5 text-[10px] font-bold text-red-500 ml-1 uppercase tracking-tight">{errors.state}</p>}
        </div>
        <div>
          <label className={labelClasses}>Zip Code</label>
          <input
            type="text"
            name="postalCode"
            placeholder="Zip / Postal"
            value={formData.postalCode}
            onChange={handleChange}
            className={inputClasses(errors?.postalCode)}
          />
          {errors?.postalCode && <p className="mt-1.5 text-[10px] font-bold text-red-500 ml-1 uppercase tracking-tight">{errors.postalCode}</p>}
        </div>
      </div>

      {/* Country & Landmark */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClasses}>Country</label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className={cn(inputClasses(errors?.country), "appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%23FB923C%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_1rem_center] bg-no-repeat cursor-pointer")}
          >
            <option value="" className="bg-slate-900 text-white">Select a country</option>
            <option value="US" className="bg-slate-900 text-white">United States</option>
            <option value="IN" className="bg-slate-900 text-white">India</option>
            <option value="GB" className="bg-slate-900 text-white">United Kingdom</option>
            <option value="CA" className="bg-slate-900 text-white">Canada</option>
            <option value="AU" className="bg-slate-900 text-white">Australia</option>
          </select>
          {errors?.country && <p className="mt-1.5 text-[10px] font-bold text-red-500 ml-1 uppercase tracking-tight">{errors.country}</p>}
        </div>
        <div>
          <label className={labelClasses}>Landmark (Optional)</label>
          <input
            type="text"
            name="landmark"
            placeholder="Near xyz temple..."
            value={formData.landmark}
            onChange={handleChange}
            className={inputClasses()}
          />
        </div>
      </div>
    </div>
  )
}
