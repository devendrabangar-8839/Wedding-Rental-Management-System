'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api } from '@/lib/api';
import { Check, Loader2, Upload, X } from 'lucide-react';
import type { Product } from '@/types';

interface EditProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditProductModal = ({ product, isOpen, onClose, onSuccess }: EditProductModalProps) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    product_type: 'both' as 'rent' | 'sell' | 'both',
    rent_price: '',
    sale_price: '',
    security_deposit: '',
    total_quantity: '1',
    sizes: ''
  });

  const getProductImage = (prod: Product): string => {
    if (prod.image_url) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      // Add updated_at timestamp to prevent caching
      const timestamp = prod.updated_at != null ? new Date(prod.updated_at).getTime() : Date.now();
      return `${apiUrl}${prod.image_url}${prod.image_url.includes('?') ? '&' : '?'}v=${timestamp}`;
    }
    return '';
  };

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        product_type: product.product_type,
        rent_price: product.rent_price?.toString() || '',
        sale_price: product.sale_price?.toString() || '',
        security_deposit: product.security_deposit?.toString() || '',
        total_quantity: product.total_quantity?.toString() || '1',
        sizes: product.sizes?.join(', ') || ''
      });
      const fullImageUrl = product.image_url ? getProductImage(product) : null;
      setExistingImageUrl(fullImageUrl);
      setImagePreview(fullImageUrl);
    }
  }, [product]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      setSelectedImage(file);
      setRemoveImage(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setRemoveImage(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCancelRemoveImage = () => {
    setRemoveImage(false);
    setImagePreview(existingImageUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    
    setLoading(true);
    setError(null);
    try {
      const submitData = new FormData();
      submitData.append('product[name]', formData.name);
      submitData.append('product[description]', formData.description);
      submitData.append('product[product_type]', formData.product_type);
      submitData.append('product[rent_price]', (parseFloat(formData.rent_price) || 0).toString());
      submitData.append('product[sale_price]', (parseFloat(formData.sale_price) || 0).toString());
      submitData.append('product[security_deposit]', (parseFloat(formData.security_deposit) || 0).toString());
      submitData.append('product[total_quantity]', (parseInt(formData.total_quantity) || 1).toString());
      formData.sizes.split(',').forEach((size) => {
        submitData.append(`product[sizes][]`, size.trim());
      });
      
      if (selectedImage) {
        submitData.append('product[image]', selectedImage);
      } else if (removeImage) {
        submitData.append('product[remove_image]', 'true');
      }

      await api.put(`/products/${product.id}`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setSelectedImage(null);
        setImagePreview(null);
        setExistingImageUrl(null);
        setRemoveImage(false);
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      const errorMsg = err.response?.data?.error?.message || err.response?.data?.message || 'Failed to update product';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl rounded-[3rem] p-10 border-none shadow-2xl">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-4xl font-black uppercase tracking-tighter">
            Edit <span className="text-primary italic">Couture</span>
          </DialogTitle>
          <DialogDescription className="text-lg font-medium italic">
            Update the details of your masterpiece.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              <Check className="h-10 w-10" />
            </div>
            <p className="font-black uppercase tracking-widest text-xl">Asset Updated!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            {error && (
              <div className="p-4 rounded-xl bg-rose-50 text-rose-600 text-xs font-black uppercase tracking-widest border border-rose-200">
                {error}
              </div>
            )}
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2 space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Asset Name</Label>
                <Input
                  required
                  className="h-14 rounded-2xl bg-secondary/30 border-none font-medium"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Type</Label>
                <Select value={formData.product_type} onValueChange={v => setFormData({ ...formData, product_type: v as 'rent' | 'sell' | 'both' })}>
                  <SelectTrigger className="h-14 rounded-2xl bg-secondary/30 border-none font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl font-black uppercase text-xs">
                    <SelectItem value="rent">RENT</SelectItem>
                    <SelectItem value="sell">SELL</SelectItem>
                    <SelectItem value="both">BOTH</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Quantity</Label>
                <Input
                  type="number"
                  required
                  className="h-14 rounded-2xl bg-secondary/30 border-none font-medium"
                  value={formData.total_quantity}
                  onChange={e => setFormData({ ...formData, total_quantity: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Rent Price</Label>
                <Input
                  type="number"
                  required
                  className="h-14 rounded-2xl bg-secondary/30 border-none font-medium"
                  value={formData.rent_price}
                  onChange={e => setFormData({ ...formData, rent_price: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Deposit</Label>
                <Input
                  type="number"
                  required
                  className="h-14 rounded-2xl bg-secondary/30 border-none font-medium"
                  value={formData.security_deposit}
                  onChange={e => setFormData({ ...formData, security_deposit: e.target.value })}
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Sizes (comma split)</Label>
                <Input
                  className="h-14 rounded-2xl bg-secondary/30 border-none font-medium"
                  placeholder="S, M, L, XL"
                  value={formData.sizes}
                  onChange={e => setFormData({ ...formData, sizes: e.target.value })}
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Description</Label>
                <Textarea
                  className="min-h-[100px] rounded-3xl bg-secondary/30 border-none font-medium py-4 px-6"
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="col-span-2 space-y-3">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Product Image</Label>
                <div className="relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="edit-product-image"
                  />
                  {imagePreview && !removeImage ? (
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-secondary/20 border-2 border-primary/20">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 transition-colors shadow-lg"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : removeImage ? (
                    <div className="aspect-[4/3] rounded-2xl border-2 border-dashed border-primary/30 bg-secondary/20 flex flex-col items-center justify-center">
                      <p className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-4">Image will be removed</p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancelRemoveImage}
                        className="rounded-full px-6"
                      >
                        Cancel Removal
                      </Button>
                    </div>
                  ) : (
                    <label
                      htmlFor="edit-product-image"
                      className="flex flex-col items-center justify-center aspect-[4/3] rounded-2xl border-2 border-dashed border-primary/30 bg-secondary/20 cursor-pointer hover:border-primary/60 hover:bg-secondary/40 transition-all group"
                    >
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <Upload className="h-8 w-8" />
                      </div>
                      <p className="mt-4 text-sm font-black uppercase tracking-widest text-muted-foreground">Click to upload new image</p>
                      <p className="mt-1 text-[10px] font-bold text-muted-foreground">PNG, JPG up to 5MB</p>
                    </label>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter className="pt-6">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-16 rounded-full font-black uppercase tracking-widest bg-primary shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
              >
                {loading ? <Loader2 className="animate-spin h-6 w-6" /> : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
