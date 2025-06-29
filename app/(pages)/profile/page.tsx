import { Modal } from "@/components/layouts/modal";
import { auth } from "@/lib/auth";
import { getUserById } from "@/server/actions/users.action";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ProfileForm } from "./_components/profile-form";

export default async function ProfilePage() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return redirect("/auth/login");
    if (session.user.id) {
        const user = await getUserById(session.user.id);
        if (user?.building && user.flat) return redirect("/");
    }

    return (
        <Modal title="Complete Profile" content={<ProfileForm />} initOpen>
            ProfilePage
        </Modal>
    );
}
