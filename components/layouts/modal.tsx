'use client';
import {
  createContext,
  type ReactNode,
  useContext,
  useId,
  useState,
} from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type Props = {
  children: ReactNode;
  content: ReactNode;
  title: string;
  description?: string;
  initOpen?: boolean;
};

type ModalContextProps = {
  modalId: string;
  closeModal: (id: string) => void;
};

const ModalContext = createContext({} as ModalContextProps);

export function Modal({
  children,
  title,
  description,
  content,
  initOpen,
}: Props) {
  const modalId = useId();
  const [open, setOpen] = useState(!!initOpen);
  const closeModal = (id: string) => {
    if (id === modalId) setOpen(false);
  };

  return (
    <ModalContext.Provider value={{ modalId, closeModal }}>
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="w-full sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="p-4">{content}</div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ModalContext.Provider>
  );
}

export const useModal = () => useContext(ModalContext);
