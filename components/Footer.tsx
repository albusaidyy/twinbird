'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAppConfig } from '@/components/providers/AppConfigProvider';
import { isColorDark } from '@/lib/utils';
import { getIcon } from '@/lib/icons';
import { MapPinIcon, PhoneIcon, MailIcon, ClockIcon } from 'lucide-react';

export function Footer() {
  const { config } = useAppConfig();
  const footer = config.homepage.footer;
  const branding = config.branding;

  if (!footer.enabled) return null;

  const isDark = isColorDark(footer.backgroundColor || '#020617');

  return (
    <footer 
      className={`pt-16 pb-8 border-t border-white/10 mt-20 relative ${isDark ? 'dark text-slate-300' : 'text-slate-700'}`}
      style={{ backgroundColor: footer.backgroundColor || '#020617' }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Col 1: Branding & Description */}
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              {branding.logoUrl ? (
                <Image src={branding.logoUrl} alt={branding.appName} width={400} height={400} className="w-auto h-48 object-contain object-left" style={{ width: 'auto' }} />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold text-white shadow-md" style={{ backgroundColor: branding.primaryColor }}>
                  {branding.appName.charAt(0)}
                </div>
              )}
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              {footer.description}
            </p>
            
            {footer.socials.enabled && footer.socials.items.filter(s => s.enabled).length > 0 && (
              <div className="flex items-center gap-3 pt-2">
                {footer.socials.items.filter(s => s.enabled).map((social, i) => {
                  const Icon = getIcon(social.icon);
                  return (
                    <a key={i} href={social.url} target="_blank" rel="noopener noreferrer" 
                       className="flex h-10 w-10 items-center justify-center rounded-full transition-transform hover:scale-110"
                       style={{ backgroundColor: `${branding.accentColor}20`, color: branding.accentColor }}>
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6">Quick Links</h3>
            {footer.quickLinks.enabled && (
              <ul className="space-y-4">
                {footer.quickLinks.items.filter(l => l.enabled).map((link, i) => (
                  <li key={i}>
                    <Link href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Col 3: Top Packages */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6">Top Packages</h3>
            {footer.topPackages.enabled && (
              <ul className="space-y-4">
                {footer.topPackages.items.filter(l => l.enabled).map((link, i) => (
                  <li key={i}>
                    <Link href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Col 4: Contact Details */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6">Contact Details</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPinIcon className="h-4 w-4 shrink-0 mt-0.5" style={{ color: branding.accentColor }} />
                <span>{footer.contact.location}</span>
              </li>
              <li className="flex items-center gap-3">
                <PhoneIcon className="h-4 w-4 shrink-0" style={{ color: branding.accentColor }} />
                <span>{footer.contact.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <MailIcon className="h-4 w-4 shrink-0" style={{ color: branding.accentColor }} />
                <span>{footer.contact.email}</span>
              </li>
              <li className="flex items-start gap-3">
                <ClockIcon className="h-4 w-4 shrink-0 mt-0.5" style={{ color: branding.accentColor }} />
                <div>
                  <p>{footer.contact.workingDays}</p>
                  <p>{footer.contact.workingHours}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between border-t border-white/10 pt-8 pb-4">
          <p className="text-xs text-slate-400 font-bold">
            &copy; {new Date().getFullYear()} {branding.appName}. All Rights Reserved.
          </p>
          
          {footer.bottomLinks.enabled && (
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              {footer.bottomLinks.items.filter(l => l.enabled).map((link, i) => (
                <Link key={i} href={link.href} className="text-xs text-slate-400 font-bold hover:text-white transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
