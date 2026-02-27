'use client';

import { useState } from 'react';
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
import { Check, Loader2 } from 'lucide-react';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddProductModal = ({ isOpen, onClose, onSuccess }: AddProductModalProps) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    product_type: 'both',
    rent_price: '',
    sale_price: '',
    security_deposit: '',
    total_quantity: '1',
    sizes: 'S,M,L,XL'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/products', {
        product: {
          ...formData,
          rent_price: parseFloat(formData.rent_price),
          sale_price: parseFloat(formData.sale_price),
          security_deposit: parseFloat(formData.security_deposit),
          total_quantity: parseInt(formData.total_quantity),
          sizes: formData.sizes.split(',').map(s => s.trim())
        }
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onSuccess();
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error adding product:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl rounded-[3rem] p-10 border-none shadow-2xl">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-4xl font-black uppercase tracking-tighter">
            Add <span className="text-primary italic">Couture</span>
          </DialogTitle>
          <DialogDescription className="text-lg font-medium italic">
            Enter the details of the new masterpiece.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              <Check className="h-10 w-10" />
            </div>
            <p className="font-black uppercase tracking-widest text-xl">Asset Manifested!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
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
                <Select value={formData.product_type} onValueChange={v => setFormData({ ...formData, product_type: v })}>
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
            </div>

            <DialogFooter className="pt-6">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-16 rounded-full font-black uppercase tracking-widest bg-primary shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
              >
                {loading ? <Loader2 className="animate-spin h-6 w-6" /> : 'Manifest Asset'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
