import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
} from "@/components/ui/drawer";
import SubmitForm from "./SubmitForm";

const SubmitDrawer = () => {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size="lg" variant="outline" className="gap-2">
          <Send className="h-5 w-5" />
          Предложи свой трек
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-xl px-6 pb-8">
          <DrawerHeader className="px-0">
            <DrawerTitle className="font-display text-2xl tracking-wider">
              ПРЕДЛОЖИ СВОЙ ТРЕК
            </DrawerTitle>
            <DrawerDescription>
              Отправь ссылку на SoundCloud и мы добавим трек в ротацию
            </DrawerDescription>
          </DrawerHeader>
          <SubmitForm onSuccess={() => setOpen(false)} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default SubmitDrawer;
