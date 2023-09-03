import type { Metadata } from "next";
import Image from "next/image";
import Modal from "./components/Modal";
export const metadata: Metadata = {
  title: "Login",
};

export default function Page() {
  return (
    <section className="w-[100vw] h-[100vh] relative flex items-center justify-center">
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
