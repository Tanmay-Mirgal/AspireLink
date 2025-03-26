import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  GraduationCap, 
  Mail, 
  MapPin,
  Download,
  MessageSquare
} from 'lucide-react';


export function ProfileHeader({ student }) {
  return (
    <div className="w-full bg-zinc-800/30  border-b border-zinc-800">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
          <Avatar className="w-28 h-28 md:w-40 md:h-40 border-4 border-purple-500/20">
            <AvatarImage 
              src={student.profilePicture} 
              alt={student.name}
              className="object-cover"
            />
            <AvatarFallback className="bg-purple-900 text-purple-200 text-2xl md:text-3xl">
              {student.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="text-center md:text-left flex-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-zinc-100">
              {student.name}
            </h1>
            <div className="mt-2 flex items-center justify-center md:justify-start gap-2 text-zinc-400">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <span>{student.email}</span>
            </div>
            
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
              <div className="flex items-center gap-2 bg-purple-500/10 px-4 py-2 rounded-full">
                <GraduationCap className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span className="text-purple-200">{student.major}</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-emerald-200">{student.contactInfo.address}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 md:self-start">
            <Button 
              className="bg-purple-600 hover:bg-purple-500 text-white"
              size="lg"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Resume
            </Button>
            <Button 
              variant="outline" 
              className="border-zinc-700 text-purple-600 hover:bg-zinc-800 hover:text-zinc-100"
              size="lg"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Contact
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}