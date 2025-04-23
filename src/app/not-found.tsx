import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const NotFound = () => {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center text-center">
      <h1 className="font-cinzel text-[96px] md:text-[200px] lg:text-[288px] text-orange-900/40">
        404
      </h1>
      <Link href={"/"}>
        <Button variant="primary" className="mt-8">
          Back to Home
        </Button>
      </Link>
    </main>
  );
};

export default NotFound;
