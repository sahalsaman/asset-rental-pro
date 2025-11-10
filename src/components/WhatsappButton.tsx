"use client";

import Image from "next/image";
import { app_config } from "../../app-config";
import wa_logo from "../../public/wa-logo.png";

export default function WhatsappButton() {
  const openWhatsappChat = () => {
    const whatsappNumber = app_config.WHATSAPP_NUMBER;
    const url = `https://wa.me/${whatsappNumber}`;
    window.open(url, "_blank");
  };

  return (
    <div
      className="fixed bottom-16 right-6 z-50"
      onClick={openWhatsappChat}
    >
      <Image
        src={wa_logo}
        alt="whatsapp"
        width={60}
        className="cursor-pointer"
      />
    </div>
  );
}
