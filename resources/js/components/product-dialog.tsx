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
import { ProductForm } from "./product-form";
import type { Product } from "@/types/product";

type ProductDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product?: Product | null;
};


export function ProductDialog({
    open,
    onOpenChange,
    product,
}: ProductDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">

                <DialogHeader>

                    <DialogTitle>
                        Add Product
                    </DialogTitle>

                    <DialogDescription>
                        Create a new inventory item.
                    </DialogDescription>

                </DialogHeader>

                <ProductForm />

                <DialogFooter>

                    <Button variant="outline">
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