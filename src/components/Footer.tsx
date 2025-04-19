'use client';

import Link from 'next/link';
import { FiLinkedin, FiTwitter, FiGithub, FiMail } from 'react-icons/fi';
import { RiAiGenerate } from 'react-icons/ri';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Team', href: '/team' },
        { name: 'Careers', href: '/careers' },
        { name: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'Research',
      links: [
        { name: 'Projects', href: '/research' },
        { name: 'Publications', href: '/publications' },
        { name: 'Resources', href: '/resources' },
        { name: 'Demo', href: '/demo' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookies' },
      ],
    },
  ];

  return (
    <footer className="bg-[#0a0a0a] border-t border-[var(--border)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <RiAiGenerate className="h-8 w-8 text-[var(--secondary)]" />
              <span className="text-xl font-bold text-white">
                <span className="text-[var(--secondary)]">Deep</span>
                <span className="text-[var(--accent)]">Fake</span>
                <span>Lab</span>
              </span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              Our research team is at the forefront of developing cutting-edge
              technologies to detect and analyze AI-generated deepfake content.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[var(--secondary)] transition-colors duration-300"
              >
                <FiLinkedin size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[var(--secondary)] transition-colors duration-300"
              >
                <FiTwitter size={20} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[var(--secondary)] transition-colors duration-300"
              >
                <FiGithub size={20} />
              </a>
              <a
                href="mailto:contact@deepfakelab.com"
                className="text-gray-400 hover:text-[var(--secondary)] transition-colors duration-300"
              >
                <FiMail size={20} />
              </a>
            </div>
          </div>

          {footerLinks.map((column) => (
            <div key={column.title}>
              <h3 className="text-white font-bold mb-4">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-[var(--secondary)] transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[var(--border)] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {currentYear} DeepFake Detection Research Lab. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link
              href="/privacy"
              className="text-gray-500 hover:text-[var(--secondary)] text-sm transition-colors duration-300"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-gray-500 hover:text-[var(--secondary)] text-sm transition-colors duration-300"
            >
              Terms
            </Link>
            <Link
              href="/cookies"
              className="text-gray-500 hover:text-[var(--secondary)] text-sm transition-colors duration-300"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 