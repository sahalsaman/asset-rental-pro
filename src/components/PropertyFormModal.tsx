'use client';

import { IProperty } from '@/app/types';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // fixed "Inut" typo
import { Label } from '@radix-ui/react-label';
import { CurrencyType, PaymentRecieverOptions, PropertyStatus, PropertyType } from '@/utils/contants';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { apiFetch } from '@/lib/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { propertyAmenities, propertyServices } from '@/utils/data';
import MultiSelect from './ui/multiselect';
import Image from 'next/image';
import imageCompression from "browser-image-compression";

interface PropertyFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  initialData?: IProperty | null;
}

export default function PropertyFormModal({
  open,
  onClose,
  initialData,
  onSave
}: PropertyFormModalProps) {
  const [formData, setFormData] = useState<IProperty>({
    name: '',
    description: '',
    address: '',
    city: '',
    category: PropertyType.FLAT_APARTMENT,
    status: PropertyStatus.ACTIVE,
    state: "",
    country: '',
    zipCode: '',
    images: [],
    services: [],
    amenities: [],
    currency: CurrencyType.INR,
    disabled: false,
    is_paymentRecieveSelf: true,
    selctedSelfRecieveBankOrUpi: ""
  });
  const [banksList, setBanksList] = useState([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState([]);
  const router = useRouter()
  const fetchBanks = async () => {
    const res = await apiFetch("/api/banks");
    const data = await res.json();
    if (data.length > 0) {
      setBanksList(data);
    };
  }

  useEffect(() => {
    fetchBanks();
    if (initialData) {
      setFormData(initialData);
      setExistingImages(initialData?.images as any ?? []);
      
    } else {
      setFormData(prev => ({
        ...prev,
        name: '',
        address: '',
        city: '',
      }));
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave(formData);
  };

  function resetForm() {
    setFormData(
      {
        name: '',
        description: '',
        address: '',
        city: '',
        category: PropertyType.FLAT_APARTMENT,
        status: PropertyStatus.ACTIVE,
        state: "",
        country: '',
        zipCode: '',
        images: [],
        services: [],
        amenities: [],
        currency: CurrencyType.INR,
        disabled: false,
        is_paymentRecieveSelf: true,
        selctedSelfRecieveBankOrUpi: ""
      }
    );
  }


  const handleSave = async (formData: any) => {
    try {
      let res;
      let base64Images: string[] = [];

      if (imageFiles && imageFiles.length > 0) {
        base64Images = await Promise.all(
          imageFiles.map(
            (file) =>
              new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
              })
          )
        );
      }

      const payload = {
        ...formData,
        new_images: base64Images,
        existingImages
      };

      if (initialData?._id) {
        res = await fetch(`/api/property?id=${initialData._id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" },
        });
      } else {
        res = await fetch("/api/property", {
          method: "POST",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" },
        });
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save property");
      }

      toast.success(initialData?._id ? "Property updated successfully!" : "Property added successfully!");
      resetForm();
      onSave();
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error(error.message || "Something went wrong. Please try again.");
    }
  };


  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (files.length + imageFiles.length+(existingImages.length??0) > 6) {
      toast.error("You can upload a maximum of 6 images.");
      return;
    }

    const compressedImages: File[] = [];

    for (const file of files) {
      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1280,
          useWebWorker: true,
        };

        let compressedFile = file;
        if (file.size > 1024 * 1024) {
          compressedFile = await imageCompression(file, options);
          toast.success(`Compressed ${file.name} to ${(compressedFile.size / 1024).toFixed(1)} KB`);
        }

        compressedImages.push(compressedFile);
      } catch (err) {
        console.error("Compression failed:", err);
        toast.error(`Failed to compress ${file.name}`);
      }
    }

    setImageFiles((prev) => [...prev, ...compressedImages]);
  };



  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto overscroll-contain p-6">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit' : 'Add'} Property</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Upload Images <span className="text-xs text-gray-500 mt-1">
              (Max 6 images, each under 1 MB)
            </span>
            </Label>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="mt-1"
            />

            {(imageFiles.length > 0 || (existingImages?.length ?? 0) > 0)  && (
              <div className="grid grid-cols-3 gap-3 mt-4">
                {existingImages.map((image:any, i) => (
                  <div
                    key={`existing-${i}`}
                    className="relative w-full h-24 border rounded-lg overflow-hidden group"
                  >
                    <Image src={image?.url} alt={`Existing ${i}`} fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() =>
                        setExistingImages((prev) => prev.filter((_, index) => index !== i))
                      }
                      className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded-full"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {imageFiles.map((file, i) => (
                  <div
                    key={i}
                    className="relative w-full h-24 border rounded-lg overflow-hidden group"
                  >
                    {/* Image Preview */}
                    <div className=" w-full h-full">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${i}`}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* ❌ Remove Button */}
                    <button
                      type="button"
                      onClick={() =>
                        setImageFiles((prev) => prev.filter((_, index) => index !== i))
                      }
                      className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded-full   transition-all"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}


          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="multiple-unit"
              // checked={formData?.is_paymentRecieveSelf || false}
              // onCheckedChange={(checked) =>
              //   setFormData((prev) => ({ ...prev, is_paymentRecieveSelf: checked }))
              // }
              checked={true}
            />
            <Label htmlFor="multiple-unit">Receive Payment Yourself </Label>
          </div>
          {formData?.is_paymentRecieveSelf && (
            <div>
              <Label>Select Bank</Label>
              <div className="flex items-center gap-2">
                <select
                  name="selctedSelfRecieveBankOrUpi"
                  value={formData.selctedSelfRecieveBankOrUpi || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required={formData?.is_paymentRecieveSelf}
                >
                  <option value="">Select Bank/UPI*</option>
                  {banksList.length > 0 ? (
                    banksList.map((i: any) => (
                      <option key={i?._id} value={i?._id}>
                        {i?.accountHolderName} -{" "}
                        {i?.paymentRecieverOption === PaymentRecieverOptions.BANK
                          ? i?.bankName
                          : i?.paymentRecieverOption}
                      </option>
                    ))
                  ) : (
                    <option disabled>No Bank/UPI added</option>
                  )}
                </select>

                {/* Add Bank Button */}
                <button
                  type="button"
                  onClick={() => router.push("/owner/bank-upi-list")}
                  className="px-3 py-1 bg-green-700 text-xs text-white rounded hover:bg-green-800"
                >
                  Add Bank/UPI
                </button>
              </div>
            </div>
          )}


          <Label>Property name*</Label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Property name"
            required
          />
          <Label>Property Overview*</Label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter your amenities and services"
            required
          />
          <Label>Address*</Label>
          <Input
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            required
          />
          <Label>City*</Label>
          <Input
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            required
          />

          <Label>State*</Label>
          <Input
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="State"
            required
          />
          <Label>Amenities</Label>
          <MultiSelect
            options={propertyAmenities.map((a) => ({
              label: a.name,
              value: a.value,
            }))}
            value={formData.amenities}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, amenities: val }))
            }
            placeholder="Select amenities"
          />
          <Label>Services</Label>
          <MultiSelect
            options={propertyServices.map((s) => ({
              label: s.name,
              value: s.value,
            }))}
            value={formData.services}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, services: val }))
            }
            placeholder="Select services"
          />

          <Label>Status*</Label>
          <select
            name="status"
            value={formData.status || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          >
            <option value="">Select a status</option>
            {Object.values(PropertyStatus).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>


          <Label>Category*</Label>
          <select
            name="category"
            value={formData.category || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          >
            <option value="">Select a category</option>
            {Object.values(PropertyType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <Label>Currency*</Label>
          <select
            name="currency"
            value={formData.currency || "₹"}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          >
            {Object.entries(CurrencyType).map(([code, symbol]) => (
              <option key={code} value={symbol}>
                {code} - {symbol}
              </option>
            ))}
          </select>

          <div className="w-full grid grid-cols-2 gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className='w-full' variant="green">
              {initialData ? 'Update' : 'Submit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog >
  );
}
