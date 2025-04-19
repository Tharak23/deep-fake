'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const Hero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
    }[] = [];

    const colors = ['#0070f3', '#00e5ff', '#b400ff'];

    // Create particles
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 1,
        speedY: (Math.random() - 0.5) * 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const animate = () => {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX *= -1;
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY *= -1;
        }
      });

      // Draw connections
      particles.forEach((particle, i) => {
        particles.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      });
    };

    animate();

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      ></canvas>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-[var(--secondary)] glow">Detecting</span>{' '}
              <span className="text-[var(--accent)] glow">DeepFakes</span>
              <br />
              <span>With Advanced AI</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl">
              Our research team is at the forefront of developing cutting-edge
              technologies to detect and analyze AI-generated deepfake content,
              protecting digital integrity in an era of synthetic media.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/research"
                className="btn btn-primary"
              >
                Our Research
              </Link>
              <Link
                href="/demo"
                className="btn btn-secondary"
              >
                Try Our Demo
              </Link>
            </div>
            <div className="mt-12 flex items-center space-x-6">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-[var(--card-bg)] overflow-hidden"
                  >
                    <Image
                      src="/placeholders/team-member-1.jpg"
                      alt={`Team member ${i}`}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm text-gray-400">
                  Join our team of researchers
                </p>
                <Link
                  href="/careers"
                  className="text-[var(--secondary)] hover:underline text-sm"
                >
                  View open positions →
                </Link>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/20 rounded-full blur-3xl"></div>
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <div className="w-4/5 h-4/5 rounded-xl overflow-hidden border border-[var(--border)] glow-box shadow-xl">
                  <Image
                    src="/placeholders/deepfake-detection.png"
                    alt="DeepFake Detection Visualization"
                    width={500}
                    height={500}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 -mr-4 mt-4">
              <div className="bg-[var(--card-bg)] rounded-lg p-3 shadow-lg border border-[var(--border)]">
                <div className="text-[var(--secondary)] font-mono text-sm">
                  Accuracy: 99.7%
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 -ml-4 mb-4">
              <div className="bg-[var(--card-bg)] rounded-lg p-3 shadow-lg border border-[var(--border)]">
                <div className="text-[var(--accent)] font-mono text-sm">
                  Processing: 24ms
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 