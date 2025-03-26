import LandingPage from '@/components/landingpage/LandingPage';
import MinimalistSidebar from '@/components/sidebar/MinimalistSidebar';
import React from 'react';


function Home() {
    return (
        <div className="flex">
            <MinimalistSidebar />
            <main className="ml-16 flex-grow">
                <LandingPage />
            </main>
        </div>
    );
}

export default Home;