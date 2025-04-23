export const Footer = () => {
  return (
    <footer className="mx-auto w-full flex flex-col sm:flex-row justify-between gap-7 sm:gap-0 text-basic fill-bg-white bg-white max-sm:py-10 sm:h-[300px] px-5 sm:px-15 relative z-50">
      <div className="flex flex-col gap-1 sm:gap-3 items-center sm:items-start justify-center">
        <div className="font-hepta font-bold text-h5 md:text-h3 text-orange-500">
          Sizopi
        </div>
        <div className="text-black font-outfit text-h7 md:text-h6 font-medium">
          sizopi14@gmail.com
        </div>
      </div>

      <div className="flex flex-col gap-7 sm:gap-[29px] items-center sm:items-end justify-center text-h8 md:text-h6 font-medium">
        © 2025 Sizopi
      </div>
    </footer>
  );
};

export default Footer;
