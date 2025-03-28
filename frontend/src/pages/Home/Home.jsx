import LandingPage from '@/components/landingpage/LandingPage';
import MinimalistSidebar from '@/components/sidebar/ModernNavbar';

import React from 'react';


function Home() {
    return (
        <>
       
        <div className="flex">
            <main className="flex-grow">
                <LandingPage />
            </main>
        </div>
        </>
    );
}

export default Home;