import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ProductForm } from "./product-form";
import type { Product } from "@/types/product";

type ProductDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;

    editingProduct: Product | null;

    form: any;
    setForm: React.Dispatch<React.SetStateAction<any>>;
    onSave: () => void;
};


export function ProductDialog({
    open,
    onOpenChange,
    editingProduct,
    form,
    setForm,
    onSave,
}: ProductDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">

                <DialogHeader>

                    <DialogTitle>
                        {editingProduct ? "Edit Product" : "Add Product"}
                    </DialogTitle>

                    <DialogDescription>
                        {editingProduct
                            ? "Update this inventory item."
                            : "Create a new inventory item."}
                    </DialogDescription>

                </DialogHeader>

                <ProductForm
                    form={form}
                    setForm={setForm}
                />

                <DialogFooter>

                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>

                    <Button onClick={onSave}>
                        Save Product
                    </Button>

                </DialogFooter>

            </DialogContent>
        </Dialog>
    );
}