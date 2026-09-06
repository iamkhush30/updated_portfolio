
"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Badge } from '@/shared/ui/badge';
import { Cloud, Palette, Server } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface SkillItem {
  title: string;
  bgTitle: string;
  description: string;
  icon: React.ReactNode;
  tags: string[];
}

const skills: SkillItem[] = [
  {
    title: "UI/UX Design",
    bgTitle: "Design",
    description: `I design wireframes, user flows, and prototypes interfaces that are clear, functional, and visually 
                  deliberate — from information architecture and user flow design 
                  to refined screens in Figma. I map out how users move 
                  through a product before touching the visual layer. Every 
                  layout decision has a reason. I approach each project by 
                  understanding the context first, then building toward a design 
                  that works before making it look good.`,
    icon: <Palette className="w-10 h-10" />,
    tags: ["UX Design", "UI Design", "Wireframing", "Prototyping"]
  },
  {
    title: "DevOps Engineering",
    bgTitle: "Systems",
    description: `I build automated pipelines that handle everything from code commit to containerized deployment — including artifact management with Nexus Repository Manager and container orchestration with Kubernetes. No manual handoffs, no deployment guesswork. The goal is simple — code that passes should 
                  ship without anyone touching it manually.`,
    icon: <Server className="w-10 h-10" />,
    tags: ["Pipeline Automation", "Artifact Management", "build Automation"]
  },
  {
    title: "AWS Cloud Infrastructure",
    bgTitle: "Cloud",
    description: `I design and manage cloud environments on AWS — provisioning EC2 instances with the right sizing, structuring S3 buckets with proper lifecycle policies, and locking down access through fine-grained IAM roles and policies. CloudWatch sits on top of everything, giving me real-time visibility into what's 
    running and alerting me before things break. The goal isn't just to get things running in the cloud — it's to make sure they stay running, stay secure, and stay observable without constant manual intervention.`,
    icon: <Cloud className="w-10 h-10" />,
    tags: ["EC2 & Compute", "S3 & Storage", "IAM & Policies"]
  },
];

const SkillCard = ({
  skill,
  index,
  isEven,
  isVisible,
  cardRef
}: {
  skill: SkillItem;
  index: number;
  isEven: boolean;
  isVisible: boolean;
  cardRef: (el: HTMLDivElement | null) => void;
}) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Reduced intensity: multiplier changed from 10 to 4 to match project pages
    const tiltX = ((y - centerY) / centerY) * -4;
    const tiltY = ((x - centerX) / centerX) * 4;

    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      data-index={index}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative w-full lg:w-[62%] min-h-[360px] sm:min-h-[420px] md:min-h-[460px] p-6 sm:p-8 md:p-12 bg-white card-surface transition-all duration-700 group opacity-0 flex-none flex flex-col overflow-hidden hover:border-primary/50",
        isVisible && "animate-in fade-in slide-in-from-bottom-24 fill-mode-both opacity-100",
        isEven ? "lg:mr-12 lg:-rotate-1" : "lg:ml-12 lg:-rotate-1"
      )}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        // Reduced shadow intensity: multipliers changed to 0.8, blur reduced to 40px
        boxShadow: tilt.x === 0 && tilt.y === 0
          ? '0 10px 30px -5px rgba(0,0,0,0.05)'
          : `${-tilt.y * 0.8}px ${tilt.x * 0.8}px 40px -10px rgba(0,0,0,0.15)`,
        transition: tilt.x === 0 && tilt.y === 0
          ? 'all 0.7s cubic-bezier(0.2, 0, 0.2, 1), box-shadow 0.7s ease'
          : 'transform 0.1s linear, box-shadow 0.1s linear, border-color 0.3s ease, opacity 0.7s cubic-bezier(0.2, 0, 0.2, 1)',
        transformStyle: 'preserve-3d'
      }}
    >
      <div
        className="relative z-10 pointer-events-none w-full h-full flex flex-col flex-grow"
        style={{ transform: 'translateZ(40px)' }}
      >
        <div className="flex items-start justify-between mb-8">
          <div className="text-primary">
            {skill.icon}
          </div>
        </div>

        <h3 className="text-card-title mb-4">
          {skill.title}
        </h3>

        <p className="text-body mb-8 max-w-2xl flex-grow">
          {skill.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {skill.tags.map((tag, tagIdx) => (
            <Badge key={tagIdx} variant="capsule">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export const SkillsParallax = () => {
  const [scrollOffset, setScrollOffset] = useState(0);
  const [visibleIndices, setVisibleIndices] = useState<Set<number>>(new Set());
  const [headerVisible, setHeaderVisible] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const sectionProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
      const clampedProgress = Math.max(0, Math.min(1, sectionProgress));

      setScrollOffset(clampedProgress * 250 - 125);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === headerRef.current) {
              setHeaderVisible(true);
              observer.unobserve(entry.target);
            } else {
              const index = Number(entry.target.getAttribute('data-index'));
              setVisibleIndices((prev) => new Set(prev).add(index));
              observer.unobserve(entry.target);
            }
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -5% 0px'
      }
    );

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative z-10 py-[var(--space)]"
    >
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div
          ref={headerRef}
          className={cn(
            "mb-16 md:mb-24 space-y-4 opacity-0 transition-opacity duration-1000",
            headerVisible && "animate-fade-in opacity-100"
          )}
        >
          <span className="text-label text-primary">Capabilities</span>
          <h2 className="text-heading text-foreground">
            My Lab
          </h2>
        </div>

        <div className="space-y-12 md:space-y-24">
          {skills.map((skill, index) => {
            const isEven = index % 2 === 0;
            const itemOffset = scrollOffset * 1.0; // Consistent parallax intensity for all cards
            const isCardVisible = visibleIndices.has(index);

            return (
              <div
                key={index}
                className={cn(
                  "relative flex flex-col items-center",
                  isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                )}
              >
                <div
                  className={cn(
                    "absolute -z-10 select-none pointer-events-none opacity-[0.03] font-heading font-black leading-none transition-transform duration-500 ease-out will-change-transform text-5xl sm:text-7xl md:text-9xl lg:text-[12rem] text-foreground",
                    isEven ? "left-[10%] lg:left-[55%]" : "right-[-3%] lg:right-[45%]"
                  )}
                  style={{ transform: `translateY(${itemOffset}px)` }}
                >
                  {skill.bgTitle}
                </div>

                <SkillCard
                  skill={skill}
                  index={index}
                  isEven={isEven}
                  isVisible={isCardVisible}
                  cardRef={(el) => { cardRefs.current[index] = el; }}
                />

                <div className="hidden lg:block lg:w-2/5"></div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-border to-transparent -z-20"></div>
    </div>
  );
};
