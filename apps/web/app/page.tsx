
import React from 'react'

import Feature from "~/shared/components/landing/features";
import { Footer } from '~/shared/components/landing/footer';
import Header2 from "~/shared/components/landing/header";
import LucyHero from "~/shared/components/landing/hero";
import { JoinWishList } from '~/shared/components/landing/join-wishlist';
import SimplePricing from "~/shared/components/landing/pricing";
import { Problems } from '~/shared/components/landing/problems';
import { SplitEntitiesCTA } from '~/shared/components/landing/split-entities-cta';

export default function Page() {
  
  return (
    <main className="bg-background">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(229,62,62,0.2),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(229,62,62,0.15),rgba(30,30,40,0))]"></div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_90%,rgba(229,62,62,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_10%_90%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_20%,rgba(255,100,150,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_90%_20%,rgba(100,150,255,0.05),transparent_50%)]"></div>

        <div className="bg-noise absolute inset-0 opacity-[0.02]"></div>
        <div className="absolute inset-0 opacity-5 backdrop-blur-[100px]"></div>
        <div className="absolute inset-0 [background-image:linear-gradient(rgba(229,62,62,0.05)_1px,transparent_1px),linear-gradient(to_right,rgba(229,62,62,0.05)_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.03] dark:[background-image:linear-gradient(rgba(200,200,255,0.05)_1px,transparent_1px),linear-gradient(to_right,rgba(200,200,255,0.05)_1px,transparent_1px)] dark:opacity-[0.02]"></div>
      </div>
      
      <Header2 />
      <LucyHero />
      <SplitEntitiesCTA />
      <Problems />
      <Feature />

      <JoinWishList />


      <Footer />

    </main>
  );
}
