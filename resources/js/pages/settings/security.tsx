import { Head } from '@inertiajs/react';
import { useState } from 'react';
import ChangePasswordDialog from '@/components/settings/change-password-dialog';
import DeleteUser from '@/components/settings/delete-user';
import Heading from '@/components/archive/heading';
import type { Props as ManagePasskeysProps } from '@/components/settings/manage-passkeys';
import ManagePasskeys from '@/components/settings/manage-passkeys';
import type { Props as ManageTwoFactorProps } from '@/components/settings/manage-two-factor';
import ManageTwoFactor from '@/components/settings/manage-two-factor';
import { Button } from '@/components/ui/button';
import { edit } from '@/routes/security';

type Props = {
    passwordRules: string;
} & ManagePasskeysProps &
    ManageTwoFactorProps;

export default function Security(props: Props) {
    const [passwordOpen, setPasswordOpen] = useState(false);

    return (
        <>
            <Head title="Security settings" />

            <h1 className="sr-only">Security settings</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Change password"
                    description="Update the password used to sign in to your account"
                />

                <div>
                    <Button onClick={() => setPasswordOpen(true)}>
                        Change password
                    </Button>
                </div>
            </div>

            <ChangePasswordDialog
                open={passwordOpen}
                onOpenChange={setPasswordOpen}
                passwordRules={props.passwordRules}
            />

            <ManageTwoFactor
                canManageTwoFactor={props.canManageTwoFactor}
                requiresConfirmation={props.requiresConfirmation}
                twoFactorEnabled={props.twoFactorEnabled}
            />

            <ManagePasskeys
                canManagePasskeys={props.canManagePasskeys}
                passkeys={props.passkeys}
            />

            <DeleteUser />
        </>
    );
}

Security.layout = {
    breadcrumbs: [
        {
            title: 'Security settings',
            href: edit(),
        },
    ],
};
