import { Form, Head, usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { useRef, useState } from 'react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import Heading from '@/components/archive/heading';
import InputError from '@/components/index/input-error';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import type { Auth } from '@/types';

type PageProps = {
    auth: Auth;
};

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = (usePage() as any).props;
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [photoName, setPhotoName] = useState<string | null>(null);
    const [editing, setEditing] = useState(false);
    const photoInput = useRef<HTMLInputElement>(null);

    const startEditing = () => setEditing(true);
    const cancelEditing = () => {
        setEditing(false);
        setPhotoPreview(null);
        setPhotoName(null);
    };

    return (
        <>
            <Head title="Profile settings" />

            <h1 className="sr-only">Profile settings</h1>

            <div className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                    <Heading
                        variant="small"
                        title="Profile"
                        description="Update your profile information"
                    />

                    {!editing ? (
                        <Button type="button" onClick={startEditing}>
                            Edit
                        </Button>
                    ) : (
                        <Button type="button" variant="outline" onClick={cancelEditing}>
                            Cancel
                        </Button>
                    )}
                </div>

                <Form
                    {...ProfileController.update.form()}
                    key={editing ? 'editing' : 'view'}
                    options={{
                        preserveScroll: true,
                        onSuccess: () => cancelEditing(),
                    }}
                    className="space-y-6"
                >
                    {({ processing, errors }: any) => (
                        <>
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    {(photoPreview ?? auth.user.avatar) && (
                                        <AvatarImage src={(photoPreview ?? auth.user.avatar) as string} alt="Profile photo" />
                                    )}
                                    <AvatarFallback>
                                        {(auth.user.name as string)
                                            ?.split(' ')
                                            .map((part: string) => part[0])
                                            .join('')
                                            .slice(0, 2)
                                            .toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="grid w-full gap-2">
                                    <Label htmlFor="avatar">Photo</Label>

                                    <div className="mt-1 flex items-center gap-3">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            disabled={!editing}
                                            onClick={() => photoInput.current?.click()}
                                        >
                                            Choose file
                                        </Button>

                                        <span className="truncate text-sm text-muted-foreground">
                                            {photoName ?? 'No file chosen'}
                                        </span>
                                    </div>

                                    <Input
                                        ref={photoInput}
                                        id="avatar"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        name="avatar"
                                        disabled={!editing}
                                        onChange={(event) => {
                                            const file = event.target.files?.[0];
                                            setPhotoPreview(file ? URL.createObjectURL(file) : null);
                                            setPhotoName(file ? file.name : null);
                                        }}
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.avatar}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>

                                <Input
                                    id="name"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.name}
                                    name="name"
                                    required
                                    disabled={!editing}
                                    autoComplete="name"
                                    placeholder="Full name"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.name}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>

                                <Input
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.email}
                                    name="email"
                                    required
                                    disabled={!editing}
                                    autoComplete="username"
                                    placeholder="Email address"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.email}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="phone_number">Contact number</Label>

                                <Input
                                    id="phone_number"
                                    type="tel"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.phone_number}
                                    name="phone_number"
                                    disabled={!editing}
                                    autoComplete="tel"
                                    placeholder="09171234567"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.phone_number}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="address">Address</Label>

                                <Textarea
                                    id="address"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.address}
                                    name="address"
                                    disabled={!editing}
                                    autoComplete="street-address"
                                    placeholder="Street, City, Province"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.address}
                                />
                            </div>

                            {mustVerifyEmail &&
                                auth.user.email_verified_at === null && (
                                    <div>
                                        <p className="-mt-4 text-sm text-muted-foreground">
                                            Your email address is unverified.{' '}
                                            <Link
                                                href={send()}
                                                as="button"
                                                className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                            >
                                                Click here to re-send the
                                                verification email.
                                            </Link>
                                        </p>

                                        {status ===
                                            'verification-link-sent' && (
                                            <div className="mt-2 text-sm font-medium text-green-600">
                                                A new verification link has been
                                                sent to your email address.
                                            </div>
                                        )}
                                    </div>
                                )}

                            <div className="flex items-center gap-4">
                                {editing && (
                                    <Button
                                        disabled={processing}
                                        data-test="update-profile-button"
                                    >
                                        Save
                                    </Button>
                                )}
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Profile settings',
            href: edit(),
        },
    ],
};
