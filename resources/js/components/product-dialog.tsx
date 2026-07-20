import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ProductDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function ProductDialog({
    open,
    onOpenChange,
}: ProductDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">

                <DialogHeader>

                    <DialogTitle>
                        Add Product
                    </DialogTitle>

                    <DialogDescription>
                        Fill in the product information below.
                    </DialogDescription>

                </DialogHeader>

                <div className="grid grid-cols-2 gap-6 py-4">

                    <div className="space-y-2">
                        <Label>Product Name</Label>
                        <Input placeholder="Logitech G102" />
                    </div>

                    <div className="space-y-2">
                        <Label>SKU</Label>
                        <Input placeholder="P001" />
                    </div>

                    <div className="space-y-2">
                        <Label>Supplier</Label>
                        <Input placeholder="Logitech" />
                    </div>

                    <div className="space-y-2">
                        <Label>Category</Label>
                        <Input placeholder="Mouse" />
                    </div>

                    <div className="space-y-2">
                        <Label>Stock</Label>
                        <Input
                            type="number"
                            placeholder="50"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Price</Label>
                        <Input
                            type="number"
                            placeholder="895"
                        />
                    </div>

                </div>

                <DialogFooter>

                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>

                    <Button>
                        Save Product
                    </Button>

                </DialogFooter>

            </DialogContent>
        </Dialog>
    );
}