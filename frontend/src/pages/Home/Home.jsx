import LandingPage from '@/components/landingpage/LandingPage';
import React from 'react';


function Home() {
    return (
        <>
       
        <div className="flex">
            <main className="ml-16 flex-grow">
                <LandingPage />
            </main>
        </div>
        </>
    );
}

export default Home;