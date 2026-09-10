import { Button } from "@/components/ui/button";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

import { ProductForm } from "./product-form";

type ProductDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;

    form: any;
    setForm: React.Dispatch<React.SetStateAction<any>>;
    onSave: () => void;

    editing?: boolean;
};

export function ProductDialog({
    open,
    onOpenChange,
    form,
    setForm,
    onSave,
    editing = false,
}: ProductDialogProps) {
    return (
        <Sheet
            open={open}
            onOpenChange={onOpenChange}
        >
            <SheetContent
                side="right"
                className="w-[700px] sm:max-w-[700px] h-screen overflow-y-auto p-0"
            >
                <div className="flex h-full flex-col">

                    {/* Header */}

                    <SheetHeader className="border-b px-6 py-5">

                        <SheetTitle className="text-2xl">

                            {editing
                                ? "Edit Product"
                                : "Add Product"}

                        </SheetTitle>

                    </SheetHeader>

                    {/* Form */}

                    <div className="flex-1 overflow-y-auto p-6">

                        <ProductForm
                            form={form}
                            setForm={setForm}
                        />

                    </div>

                    {/* Footer */}

                    <div className="border-t p-5 flex justify-end gap-3">

                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>

                        <Button onClick={onSave}>
                            {editing
                                ? "Save Changes"
                                : "Create Product"}
                        </Button>

                    </div>

                </div>

            </SheetContent>
        </Sheet>
    );
}