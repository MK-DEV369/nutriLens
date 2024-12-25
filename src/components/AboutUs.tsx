
import { Github, Linkedin, Twitter } from 'lucide-react';
import ajay from "./images/ajay.jpg";
import morya from "./images/morya.jpg";
import srikanth from "./images/srikanth.jpg";
import nihal from "./images/nihal.jpg";

interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
  social: {
    github?: string; 
    linkedin?: string;
    twitter?: string;
  };
}

const teamMembers: TeamMember[] = [
  {
    name: "L Moryakantha",
    role: "Lead Developer",
    image: morya,
    bio: "Full-stack developer with expertise in AI and machine learning, passionate about creating innovative solutions for health tech.",
    social: {
      github: "https://github.com/MK-DEV369",
      linkedin: "https://www.linkedin.com/in/l-moryakantha-0b7222341/",
    }
  },
  {
    name: "Nikhil",
    role: "UI/UX Designer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    bio: "Creative designer focused on crafting intuitive and beautiful user experiences in healthcare applications.",
    social: {
      github: "#",
      linkedin: "#"
    }
  },
  {
    name: "Nihal Soni",
    role: "Nutrition Specialist",
    image: nihal,
    bio: "Registered dietitian with a passion for making nutrition information accessible and easy to understand.",
    social: {
      linkedin: "http://www.linkedin.com/in/nihalsoni2004",
      github: "https://github.com/nihalsoni2004"
    }
  },
  {
    name: "Srikanth",
    role: "Backend Engineer",
    image: srikanth,
    bio: "Systems architect specializing in scalable infrastructure and machine learning implementations.",
    social: {
      github: "#",
      linkedin: "#"
    }
  },
  {
    name: "Ajay Reddy",
    role: "Product Manager",
    image: ajay,
    bio: "Strategic leader with a background in healthcare technology and product development.",
    social: {
      linkedin: "https://www.linkedin.com/in/ajay-reddy-4ab9282a4?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      twitter: "#",
      github: "https://github.com/ajayrm04",
    }
  }
];

export function AboutUs() {
  return (
    <section id="about" className="py-24 bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're a diverse team of experts committed to revolutionizing nutrition analysis through technology.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="aspect-w-1 aspect-h-1">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-emerald-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 mb-4">{member.bio}</p>
                <div className="flex space-x-4">
                  {member.social.github && (
                    <a href={member.social.github} className="text-gray-600 hover:text-emerald-600 transition-colors">
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {member.social.linkedin && (
                    <a href={member.social.linkedin} className="text-gray-600 hover:text-emerald-600 transition-colors">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {member.social.twitter && (
                    <a href={member.social.twitter} className="text-gray-600 hover:text-emerald-600 transition-colors">
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}