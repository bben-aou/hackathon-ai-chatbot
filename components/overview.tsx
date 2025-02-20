import { motion } from "framer-motion";

import Image from "next/image";

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="rounded-xl p-6 flex flex-col leading-relaxed text-center ">
        <div className="flex flex-col items-center ">
          <Image
            src={"/cercleLogo.svg"}
            alt="logo"
            height={75.94}
            width={75.94}
            
          />
          <Image src={"/logo.svg"} alt="logo" height={86.27} width={222.18} className="mb-[18.87px]" />
          <h1 className="text-[25.26px] font-light text-[#666] tracking-[-1px]">
            Votre One Stop Chat
          </h1>
          <h1 className="text-[31.26px] font-medium text-black tracking-[-1px]">
            Comment puis-je vous{" "}
            <span
              className="text-[31.26px] bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(to right, #000000, #18D4B7)",
              }}
            >
              assister
            </span>{" "}
            aujourdhui ?
          </h1>
        </div>
        <div className="flex justify-center mt-[18.87px]">
          <div className="w-[540.73px]  text-[#757575] text-[21.88px] font-normal  leading-7">
            Décrivez moi votre besoin, que ce soit de l’achat de la location du
            financement ou autre, je suis là pour vous assister !
          </div>
        </div>
      </div>
    </motion.div>
  );
};
