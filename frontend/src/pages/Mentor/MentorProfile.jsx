import { About } from "@/components/MentorProfile/About";
import { Achievements } from "@/components/MentorProfile/Achievements";
import { Expertise } from "@/components/MentorProfile/Experties";
import { Header } from "@/components/MentorProfile/Header";
import { Stats } from "@/components/MentorProfile/Stats";


function MentorProfile() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Header />

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            <Expertise />
            <Stats />
          </div>

          {/* Center Column */}
          <div className="md:col-span-2 space-y-8">
            <About />
            <Achievements />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MentorProfile;