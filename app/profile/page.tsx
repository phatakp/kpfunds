import { ProfileForm } from '@/components/auth/profile-form';
import { Modal } from '@/components/layouts/modal';
import { isLoggedInProfile } from '@/server/actions/auth.actions';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const { data } = await isLoggedInProfile();
  if (!data?.user) redirect('/auth/login');
  if (data.profile?.id) redirect('/');

  return (
    <Modal
      content={<ProfileForm user={data.user} />}
      initOpen
      title="Complete Profile"
    >
      ProfilePage
    </Modal>
  );
}
