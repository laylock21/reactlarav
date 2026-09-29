import { router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import InputError from '@/components/index/input-error';
import PasswordInput from '@/components/index/password-input';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { update as updatePassword } from '@/routes/user-password';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    passwordRules: string;
};

const emptyForm = {
    current_password: '',
    password: '',
    password_confirmation: '',
};

export default function ChangePasswordDialog({ open, onOpenChange, passwordRules }: Props) {
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const close = () => {
        onOpenChange(false);
        setForm(emptyForm);
        setErrors({});
    };

    const submit = () => {
        setProcessing(true);

        router.put(updatePassword.url(), form, {
            preserveScroll: true,
            onSuccess: () => {
                setProcessing(false);
                close();
                toast.success('Password updated.');
            },
            onError: (validationErrors: Record<string, string>) => {
                setProcessing(false);
                setErrors(validationErrors);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Change password</DialogTitle>
                    <DialogDescription>
                        Confirm your current password, then choose a new one.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="change-current_password">Current password</Label>

                        <PasswordInput
                            id="change-current_password"
                            name="current_password"
                            value={form.current_password}
                            onChange={(event) => setForm({ ...form, current_password: event.target.value })}
                            className="mt-1 block w-full"
                            autoComplete="current-password"
                            placeholder="Current password"
                        />

                        <InputError message={errors.current_password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="change-password">New password</Label>

                        <PasswordInput
                            id="change-password"
                            name="password"
                            value={form.password}
                            onChange={(event) => setForm({ ...form, password: event.target.value })}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            placeholder="New password"
                            passwordrules={passwordRules}
                        />

                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="change-password_confirmation">Confirm new password</Label>

                        <PasswordInput
                            id="change-password_confirmation"
                            name="password_confirmation"
                            value={form.password_confirmation}
                            onChange={(event) => setForm({ ...form, password_confirmation: event.target.value })}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            placeholder="Confirm new password"
                            passwordrules={passwordRules}
                        />

                        <InputError message={errors.password_confirmation} />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={close}>
                        Cancel
                    </Button>

                    <Button onClick={submit} disabled={processing} data-test="update-password-button">
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
