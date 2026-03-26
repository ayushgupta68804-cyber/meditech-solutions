import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useMedicines, useAddMedicine, useUpdateMedicine, useDeleteMedicine } from '@/hooks/useMedicines';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Edit, Trash2, Package, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

const MedicinesPage = () => {
  const { data: medicines, isLoading } = useMedicines();
  const addMedicine = useAddMedicine();
  const updateMedicine = useUpdateMedicine();
  const deleteMedicine = useDeleteMedicine();
  const { toast } = useToast();

  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    batch_no: '',
    barcode: '',
    quantity: 0,
    price: 0,
    min_threshold: 5,
    mfg_date: '',
    expiry_date: '',
    description: '',
    seller_info: '',
  });

  const filteredMedicines = medicines?.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.batch_no?.toLowerCase().includes(search.toLowerCase()) ||
    m.barcode?.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: '',
      batch_no: '',
      barcode: '',
      quantity: 0,
      price: 0,
      min_threshold: 5,
      mfg_date: '',
      expiry_date: '',
      description: '',
      seller_info: '',
    });
    setEditingMedicine(null);
  };

  const openAddDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (medicine: Medicine) => {
    setEditingMedicine(medicine);
    setFormData({
      name: medicine.name,
      batch_no: medicine.batch_no || '',
      barcode: medicine.barcode || '',
      quantity: medicine.quantity || 0,
      price: medicine.price || 0,
      min_threshold: medicine.min_threshold || 5,
      mfg_date: medicine.mfg_date || '',
      expiry_date: medicine.expiry_date || '',
      description: medicine.description || '',
      seller_info: medicine.seller_info || '',
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMedicine) {
        await updateMedicine.mutateAsync({ id: editingMedicine.id, ...formData });
        toast({ title: 'Medicine updated successfully' });
      } else {
        await addMedicine.mutateAsync(formData);
        toast({ title: 'Medicine added successfully' });
      }
      setDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this medicine?')) return;
    try {
      await deleteMedicine.mutateAsync(id);
      toast({ title: 'Medicine deleted successfully' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const isLowStock = (quantity: number, threshold: number) => quantity < threshold;
  const isExpiringSoon = (expiryDate: string | null) => {
    if (!expiryDate) return false;
    const days = Math.ceil((new Date(expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days <= 30 && days > 0;
  };
  const isExpired = (expiryDate: string | null) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-heading text-2xl font-bold">Medicines</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Medicine
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingMedicine ? 'Edit Medicine' : 'Add Medicine'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="batch_no">Batch No</Label>
                    <Input
                      id="batch_no"
                      value={formData.batch_no}
                      onChange={(e) => setFormData({ ...formData, batch_no: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="barcode">Barcode</Label>
                    <Input
                      id="barcode"
                      value={formData.barcode}
                      onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="0"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="min_threshold">Min Threshold</Label>
                    <Input
                      id="min_threshold"
                      type="number"
                      min="0"
                      value={formData.min_threshold}
                      onChange={(e) => setFormData({ ...formData, min_threshold: parseInt(e.target.value) || 5 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mfg_date">Mfg Date</Label>
                    <Input
                      id="mfg_date"
                      type="date"
                      value={formData.mfg_date}
                      onChange={(e) => setFormData({ ...formData, mfg_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="expiry_date">Expiry Date</Label>
                    <Input
                      id="expiry_date"
                      type="date"
                      value={formData.expiry_date}
                      onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="seller_info">Seller Info</Label>
                    <Input
                      id="seller_info"
                      value={formData.seller_info}
                      onChange={(e) => setFormData({ ...formData, seller_info: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={addMedicine.isPending || updateMedicine.isPending}>
                    {editingMedicine ? 'Update' : 'Add'} Medicine
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, batch, or barcode..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 text-center text-muted-foreground">Loading...</div>
            ) : !filteredMedicines?.length ? (
              <div className="py-8 text-center">
                <Package className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2 text-muted-foreground">No medicines found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Batch</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Expiry</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMedicines.map((medicine) => (
                      <TableRow key={medicine.id}>
                        <TableCell className="font-medium">{medicine.name}</TableCell>
                        <TableCell>{medicine.batch_no || '-'}</TableCell>
                        <TableCell>{medicine.quantity}</TableCell>
                        <TableCell>₹{medicine.price?.toFixed(2)}</TableCell>
                        <TableCell>
                          {medicine.expiry_date
                            ? format(new Date(medicine.expiry_date), 'dd/MM/yyyy')
                            : '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {isExpired(medicine.expiry_date) && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs text-destructive">
                                <AlertTriangle className="h-3 w-3" /> Expired
                              </span>
                            )}
                            {isExpiringSoon(medicine.expiry_date) && !isExpired(medicine.expiry_date) && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-2 py-0.5 text-xs text-warning">
                                Expiring Soon
                              </span>
                            )}
                            {isLowStock(medicine.quantity || 0, medicine.min_threshold || 5) && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs text-destructive">
                                Low Stock
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(medicine)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(medicine.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MedicinesPage;
