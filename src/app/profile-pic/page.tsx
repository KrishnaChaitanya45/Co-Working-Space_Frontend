import type { Metadata } from "next";
import Image from "next/image";
import Modal from "./components/Modal";
export const metadata: Metadata = {
  title: "Register",
};

export default function Page() {
  return (
    <section className="w-full h-[100vh] xl:h-[120vh] relative flex items-center justify-center overflow-hidden">
      <Image
        src="/assests/login_background.png"
        fill={true}
        alt="Background Image"
        className="top-0 left-0 w-[100%] h-[100%] z-0 object-cover"
      />
      <Modal />
    </section>
  );
}
