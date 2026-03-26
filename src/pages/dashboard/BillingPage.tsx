import { useState, useRef } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useMedicines } from '@/hooks/useMedicines';
import { useCreateSale } from '@/hooks/useSales';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Minus, Trash2, Search, ShoppingCart, Receipt, Camera, ScanLine } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import BarcodeScanner from '@/components/BarcodeScanner';

interface CartItem {
  medicine_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  max_quantity: number;
}

const BillingPage = () => {
  const { data: medicines } = useMedicines();
  const createSale = useCreateSale();
  const { toast } = useToast();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  const addToCart = (medicine: Medicine) => {
    const existing = cart.find((item) => item.medicine_id === medicine.id);
    if (existing) {
      if (existing.quantity >= medicine.quantity) {
        toast({ title: 'Max quantity reached', variant: 'destructive' });
        return;
      }
      setCart(cart.map((item) =>
        item.medicine_id === medicine.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        medicine_id: medicine.id,
        name: medicine.name,
        quantity: 1,
        unit_price: medicine.price || 0,
        max_quantity: medicine.quantity || 0,
      }]);
    }
    setSearchOpen(false);
    setSearchValue('');
  };

  const updateQuantity = (medicineId: string, delta: number) => {
    setCart(cart.map((item) => {
      if (item.medicine_id === medicineId) {
        const newQty = item.quantity + delta;
        if (newQty <= 0) return item;
        if (newQty > item.max_quantity) {
          toast({ title: 'Max quantity reached', variant: 'destructive' });
          return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (medicineId: string) => {
    setCart(cart.filter((item) => item.medicine_id !== medicineId));
  };

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;
    handleBarcodeScanned(barcodeInput.trim());
  };

  const handleBarcodeScanned = (barcode: string) => {
    const medicine = medicines?.find((m) => m.barcode === barcode);
    if (medicine) {
      addToCart(medicine);
      setBarcodeInput('');
      toast({ title: 'Medicine added', description: medicine.name });
    } else {
      toast({ title: 'Medicine not found', description: 'No medicine with this barcode', variant: 'destructive' });
    }
  };

  const total = cart.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast({ title: 'Cart is empty', variant: 'destructive' });
      return;
    }

    try {
      await createSale.mutateAsync({
        customer_name: customerName || null,
        customer_contact: customerContact || null,
        items: cart.map((item) => ({
          medicine_id: item.medicine_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
        })),
      });
      toast({ title: 'Sale completed successfully!' });
      setCart([]);
      setCustomerName('');
      setCustomerContact('');
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const filteredMedicines = medicines?.filter((m) =>
    m.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    m.barcode?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <DashboardLayout>
      {showScanner && (
        <BarcodeScanner
          onScan={handleBarcodeScanned}
          onClose={() => setShowScanner(false)}
        />
      )}
      <div className="space-y-6">
        <h1 className="font-heading text-2xl font-bold">Billing</h1>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left: Search and Add */}
          <div className="space-y-4 lg:col-span-2">
            {/* Barcode Input */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ScanLine className="h-5 w-5" />
                  Barcode Scanner
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBarcodeSubmit} className="flex gap-2">
                  <Input
                    ref={barcodeInputRef}
                    placeholder="Enter barcode..."
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" variant="secondary">Add</Button>
                  <Button type="button" onClick={() => setShowScanner(true)} className="gap-2">
                    <Camera className="h-4 w-4" />
                    Scan
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Medicine Search */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Search className="h-5 w-5" />
                  Search Medicine
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Search className="h-4 w-4" />
                      Search medicine by name...
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput
                        placeholder="Search medicine..."
                        value={searchValue}
                        onValueChange={setSearchValue}
                      />
                      <CommandList>
                        <CommandEmpty>No medicine found.</CommandEmpty>
                        <CommandGroup>
                          {filteredMedicines?.slice(0, 10).map((medicine) => (
                            <CommandItem
                              key={medicine.id}
                              onSelect={() => addToCart(medicine)}
                              disabled={(medicine.quantity || 0) <= 0}
                            >
                              <div className="flex w-full justify-between">
                                <div>
                                  <p className="font-medium">{medicine.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    Stock: {medicine.quantity} | ₹{medicine.price?.toFixed(2)}
                                  </p>
                                </div>
                                <Plus className="h-4 w-4" />
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </CardContent>
            </Card>

            {/* Cart */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ShoppingCart className="h-5 w-5" />
                  Cart ({cart.length} items)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    Cart is empty. Add medicines to start billing.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Medicine</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Qty</TableHead>
                          <TableHead>Subtotal</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cart.map((item) => (
                          <TableRow key={item.medicine_id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>₹{item.unit_price.toFixed(2)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => updateQuantity(item.medicine_id, -1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => updateQuantity(item.medicine_id, 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>₹{(item.quantity * item.unit_price).toFixed(2)}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFromCart(item.medicine_id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
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

          {/* Right: Checkout */}
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Checkout
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    placeholder="Optional"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerContact">Customer Contact</Label>
                  <Input
                    id="customerContact"
                    placeholder="Optional"
                    value={customerContact}
                    onChange={(e) => setCustomerContact(e.target.value)}
                  />
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  className="w-full gap-2"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={cart.length === 0 || createSale.isPending}
                >
                  <Receipt className="h-4 w-4" />
                  Complete Sale
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BillingPage;
