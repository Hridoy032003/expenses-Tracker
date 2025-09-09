import FeaturesSection from '@/components/FeatureSection';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSections';
import Navbar from '@/components/Navbar';
import { getAuthSession } from '@/lib/auth';
import React from 'react'

const page =async () => {
  const session = await getAuthSession();
  console.log(session)
  return (
    <main className="min-h-screen">
      {" "}
      <Navbar name={session?.user?.name || ""} email={session?.user?.email ||""} image={session?.user?.image ||""}/>
      <HeroSection />
      <FeaturesSection />
      <Footer />
      {/* <HeroSection />
      <FeaturesSection />
      <Footer /> */}
    </main>
  );
}

export default page