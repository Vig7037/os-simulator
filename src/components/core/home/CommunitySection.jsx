import React from 'react';
import { FaTwitter, FaGithub, FaDiscord, FaYoutube } from 'react-icons/fa';

const socials = [
  { name: 'Twitter', icon: <FaTwitter />, url: '#' },
  { name: 'GitHub', icon: <FaGithub />, url: '#' },
  { name: 'Discord', icon: <FaDiscord />, url: '#' },
  { name: 'YouTube', icon: <FaYoutube />, url: '#' },
];

export default function CommunitySection() {
  return (
    <section className="py-12 px-4 bg-gradient-to-r from-purple-700 to-purple-400 flex flex-col items-center">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-6">Join Our Community</h2>
      <div className="flex gap-6">
        {socials.map((s, i) => (
          <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="text-3xl hover:scale-125 transition-transform text-white" title={s.name}>
            {s.icon}
          </a>
        ))}
      </div>
    </section>
  );
} 