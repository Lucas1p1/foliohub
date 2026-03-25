"use client";

import { Globe, Mail, MapPin, MessageCircle } from "lucide-react";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";import { useTrack } from "@/lib/use-track";
import { getAvatarUrl, getInitials, getProjectImageUrl, getWhatsAppUrl } from "@/lib/utils";
import type { PublicProfileData } from "@/types";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "FolioHub";

export function Template2({ data: { profile, projects, services } }: { data: PublicProfileData }) {
  const { track } = useTrack(profile.id);
  const social = profile.social_links as Record<string, string>;

  return (
    <div className="min-h-screen bg-amber-50 text-gray-900">
      {/* Bold hero */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-6 pt-16 pb-20">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8">
            <div className="flex-1">
              <div className="w-16 h-16 rounded-2xl bg-amber-400 overflow-hidden flex items-center justify-center text-gray-900 text-xl font-bold mb-6">
                {profile.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={getAvatarUrl(profile.avatar_url) ?? ""} alt="" className="w-full h-full object-cover" />
                ) : (
                  getInitials(profile.full_name)
                )}
              </div>
              <h1 className="text-5xl sm:text-6xl font-black tracking-tighter leading-none mb-3">
                {profile.full_name ?? profile.username}
              </h1>
              {profile.headline && (
                <p className="text-amber-400 text-xl font-semibold">{profile.headline}</p>
              )}
              {profile.location && (
                <div className="flex items-center gap-1.5 text-white/40 text-sm mt-3">
                  <MapPin className="h-3.5 w-3.5" />{profile.location}
                </div>
              )}
            </div>
            {profile.whatsapp && (
              <a
                href={getWhatsAppUrl(profile.whatsapp, profile.full_name ?? undefined)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("whatsapp_click")}
                className="shrink-0 flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold px-8 py-4 rounded-2xl text-lg transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                Hire me now
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Bio + contact strip */}
      <section className="bg-amber-400">
        <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {profile.bio && (
            <p className="text-gray-900 font-medium max-w-xl leading-relaxed">{profile.bio}</p>
          )}
          <div className="flex items-center gap-2 shrink-0">
            {profile.email_contact && (
              <a href={`mailto:${profile.email_contact}`} onClick={() => track("email_click")}
                className="p-2.5 bg-gray-900/10 hover:bg-gray-900/20 rounded-xl transition-colors">
                <Mail className="h-5 w-5 text-gray-900" />
              </a>
            )}
            {social?.github && (
              <a href={social.github} target="_blank" rel="noopener noreferrer" onClick={() => track("github_click")}
                className="p-2.5 bg-gray-900/10 hover:bg-gray-900/20 rounded-xl transition-colors">
                <FaGithub className="h-5 w-5 text-gray-900" />
              </a>
            )}
            {social?.linkedin && (
              <a href={social.linkedin} target="_blank" rel="noopener noreferrer"
                className="p-2.5 bg-gray-900/10 hover:bg-gray-900/20 rounded-xl transition-colors">
                <FaLinkedin className="h-5 w-5 text-gray-900" />
              </a>
            )}
            {social?.twitter && (
              <a href={social.twitter} target="_blank" rel="noopener noreferrer"
                className="p-2.5 bg-gray-900/10 hover:bg-gray-900/20 rounded-xl transition-colors">
                <FaTwitter className="h-5 w-5 text-gray-900" />
              </a>
            )}
            {social?.website && (
              <a href={social.website} target="_blank" rel="noopener noreferrer" onClick={() => track("live_url_click")}
                className="p-2.5 bg-gray-900/10 hover:bg-gray-900/20 rounded-xl transition-colors">
                <Globe className="h-5 w-5 text-gray-900" />
              </a>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-20">

        {/* Services */}
        {services.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-8">Services</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((s) => (
                <div key={s.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                  {s.description && <p className="text-gray-500 text-sm leading-relaxed mb-4">{s.description}</p>}
                  {s.price && (
                    <span className="inline-block bg-amber-100 text-amber-800 text-sm font-bold px-3 py-1 rounded-full">
                      {s.price}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-8">Work</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {projects.map((p) => (
                <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                  {p.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={getProjectImageUrl(p.image_url) ?? ""} alt={p.title} className="w-full h-52 object-cover" />
                  )}
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-2">{p.title}</h3>
                    {p.description && <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">{p.description}</p>}
                    <div className="flex gap-3">
                      {p.live_url && (
                        <a href={p.live_url} target="_blank" rel="noopener noreferrer" onClick={() => track("live_url_click")}
                          className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 hover:text-amber-600 transition-colors">
                          <Globe className="h-4 w-4" /> View live
                        </a>
                      )}
                      {p.github_url && (
                        <a href={p.github_url} target="_blank" rel="noopener noreferrer" onClick={() => track("github_click")}
                          className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">
                          <FaGithub className="h-4 w-4" /> GitHub
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="bg-gray-900 rounded-3xl p-10 text-white text-center">
          <h2 className="text-3xl font-black mb-3">Let's work together</h2>
          <p className="text-white/60 mb-6 max-w-md mx-auto">
            Have a project in mind? Reach out and let's discuss what we can build.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {profile.whatsapp && (
              <a
                href={getWhatsAppUrl(profile.whatsapp, profile.full_name ?? undefined)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("whatsapp_click")}
                className="flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold px-8 py-3.5 rounded-xl transition-colors"
              >
                <MessageCircle className="h-5 w-5" /> WhatsApp me
              </a>
            )}
            {profile.email_contact && (
              <a
                href={`mailto:${profile.email_contact}`}
                onClick={() => track("email_click")}
                className="flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 text-white px-8 py-3.5 rounded-xl transition-colors"
              >
                <Mail className="h-5 w-5" /> Send email
              </a>
            )}
          </div>
        </section>
      </div>

      {/* Footer */}
      {profile.plan === "free" && (
        <footer className="text-center py-8 border-t border-gray-200">
          <a href="/" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
            Made with {APP_NAME}
          </a>
        </footer>
      )}
    </div>
  );
}
