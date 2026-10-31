import React, { useState } from 'react';
import {
  Users,
  Lock,
  Heart,
  MessageSquare,
  Send,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  EyeOff,
  Stethoscope,
  ClipboardCheck,
  Hash,
} from 'lucide-react';
import {
  type MotherProfile,
  type DoctorProfile,
  type CommunityPost,
  type PeerDirectMessage,
  resolveAssignedDoctor,
} from '../utils/riskEngine';
import {
  evaluateCommunitySafetyGuardian,
  type SafetyGuardianAlert,
} from '../utils/telemetryParser';

interface MomCircleCommunityProps {
  isAuthenticatedMother: boolean;
  currentMother: MotherProfile;
  doctors: DoctorProfile[];
  posts: CommunityPost[];
  peerMessages: PeerDirectMessage[];
  onCreatePost: (
    channel: CommunityPost['channel'],
    content: string,
    isAnonymous: boolean
  ) => void;
  onLikePost: (postId: string) => void;
  onSendPeerMessage: (toPeerName: string, text: string) => void;
  onNotifyAssignedDoctorFromGuardian: (
    motherId: string,
    assignedDoctor: DoctorProfile,
    postText: string
  ) => void;
  onOpenEpdsFromGuardian: () => void;
  onRequireSignIn?: () => void;
}

const CHANNELS: {
  id: CommunityPost['channel'];
  label: string;
  desc: string;
}[] = [
  {
    id: '#all-mothers-lounge',
    label: '#all-mothers-lounge',
    desc: 'Warm peer support for registered postpartum mothers',
  },
  {
    id: '#3am-feeding-support',
    label: '#3am-feeding-support',
    desc: 'Late-night nursing, bottle feeds & cluster feeding solidarity',
  },
  {
    id: '#sleep-deprivation-vent',
    label: '#sleep-deprivation-vent',
    desc: 'Safe space to vent about fragmented nights & partner shifts',
  },
  {
    id: '#postpartum-healing',
    label: '#postpartum-healing',
    desc: 'C-section & postnatal body recovery tips',
  },
  {
    id: '#bengaluru-moms-circle',
    label: '#bengaluru-moms-circle',
    desc: 'Karnataka & Bengaluru maternal peer circle',
  },
];

export const MomCircleCommunity: React.FC<MomCircleCommunityProps> = ({
  isAuthenticatedMother,
  currentMother,
  doctors,
  posts,
  peerMessages,
  onCreatePost,
  onLikePost,
  onSendPeerMessage,
  onNotifyAssignedDoctorFromGuardian,
  onOpenEpdsFromGuardian,
  onRequireSignIn,
}) => {
  const [selectedChannel, setSelectedChannel] =
    useState<CommunityPost['channel']>('#all-mothers-lounge');
  const [postDraft, setPostDraft] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(true);
  const [guardianAlert, setGuardianAlert] = useState<SafetyGuardianAlert | null>(null);
  const [doctorNotifiedBanner, setDoctorNotifiedBanner] = useState<string | null>(null);

  // 1-on-1 Peer Chat Drawer state
  const [activePeerName, setActivePeerName] = useState<string>('Sneha Kulkarni (Week 9)');
  const [peerChatDraft, setPeerChatDraft] = useState<string>('');

  const assignedDoctor = resolveAssignedDoctor(currentMother, doctors);

  // Strictly Auth-Gated Lock Screen for Non-Registered Visitors
  if (!isAuthenticatedMother) {
    return (
      <div
        data-testid="momcircle-auth-lock-screen"
        className="max-w-xl mx-auto my-12 bg-white border border-[#E6DFD3] rounded-2xl p-8 text-center space-y-5 shadow-xs"
      >
        <div className="w-14 h-14 rounded-2xl bg-[#F4EFFA] border border-[#E2D6F3] flex items-center justify-center text-[#5B3E85] mx-auto">
          <Lock className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-[#FFF5F5] text-[#E11D48] text-xs font-mono font-semibold">
            Strictly Auth-Gated Maternal Sanctuary
          </span>
          <h2 className="font-display text-2xl font-semibold text-[#1F2421]">
            MomCircle Peer Community is Reserved for Verified Mothers
          </h2>
          <p className="text-xs sm:text-sm text-[#5A625D] leading-relaxed">
            To protect maternal privacy, only registered mothers signed in with their confidential{' '}
            <code className="font-mono font-semibold">NM-MOM-XXXX</code> ID can view or post in
            MomCircle channels.
          </p>
        </div>
        {onRequireSignIn && (
          <button
            type="button"
            onClick={onRequireSignIn}
            className="px-6 py-3 rounded-xl bg-[#5B3E85] hover:bg-[#49306B] text-white text-xs sm:text-sm font-semibold transition-colors"
          >
            Sign In with Your NM-MOM-XXXX ID to Enter MomCircle →
          </button>
        )}
      </div>
    );
  }

  const handlePublishPost = (e: React.FormEvent) => {
    e.preventDefault();
    const text = postDraft.trim();
    if (!text) return;

    // Evaluate Dynamic AI Safety Guardian against the mother's specific assigned doctor
    const evaluation = evaluateCommunitySafetyGuardian(text, currentMother, doctors);
    if (evaluation.triggered) {
      setGuardianAlert(evaluation);
    }

    onCreatePost(selectedChannel, text, isAnonymous);
    setPostDraft('');
  };

  const handleTriggerDistressDemo = () => {
    const sampleDistress =
      "It's 3:15 AM and I feel so overwhelmed and hopeless, baby has been crying nonstop and I can't do this anymore.";
    setPostDraft(sampleDistress);
    const evaluation = evaluateCommunitySafetyGuardian(
      sampleDistress,
      currentMother,
      doctors
    );
    setGuardianAlert(evaluation);
    onCreatePost('#3am-feeding-support', sampleDistress, isAnonymous);
    setSelectedChannel('#3am-feeding-support');
  };

  const filteredPosts =
    selectedChannel === '#all-mothers-lounge'
      ? posts
      : posts.filter((p) => p.channel === selectedChannel);

  return (
    <div data-testid="momcircle-community-view" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-[#E6DFD3] rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#F4EFFA] border border-[#E2D6F3] flex items-center justify-center text-[#5B3E85] shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-lg sm:text-xl font-semibold text-[#1F2421]">
                MomCircle — Auth-Gated Verified Mothers Peer Sanctuary
              </h2>
              <span className="px-2.5 py-0.5 rounded-md bg-[#E3F2E6] text-[#2E6F40] text-xs font-mono font-semibold">
                Verified: {currentMother.hospitalId}
              </span>
            </div>
            <p className="text-xs text-[#5A625D] mt-0.5">
              Protected by Dynamic AI Safety Guardian · Linked to your assigned clinician:{' '}
              <strong className="text-[#1F2421]">{assignedDoctor.fullName}</strong> (
              {assignedDoctor.hospitalName})
            </p>
          </div>
        </div>

        <button
          type="button"
          data-testid="simulate-guardian-distress-btn"
          onClick={handleTriggerDistressDemo}
          className="px-3.5 py-2 rounded-xl bg-[#FFF5F5] hover:bg-[#FCE8E8] border border-[#F5D0D6] text-[#E11D48] text-xs font-semibold flex items-center gap-1.5 self-start lg:self-auto shrink-0 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Test 3 AM Distress Post (Trigger AI Safety Guardian)</span>
        </button>
      </div>

      {/* DYNAMIC AI SAFETY GUARDIAN PRIVATE COMPASSIONATE BANNER */}
      {guardianAlert && guardianAlert.triggered && (
        <div
          role="alert"
          data-testid="ai-safety-guardian-banner"
          className="p-6 rounded-2xl bg-[#F4EFFA] border-2 border-[#5B3E85] shadow-md space-y-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E2D6F3] flex items-center justify-center text-[#5B3E85] shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#5B3E85]">
                  Private AI Safety Guardian · Visible Only to You ({currentMother.name})
                </div>
                <p
                  data-testid="ai-safety-guardian-text"
                  className="text-sm sm:text-base font-semibold text-[#1F2421] leading-relaxed"
                >
                  {guardianAlert.bannerMessage}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              data-testid="guardian-notify-doctor-btn"
              onClick={() => {
                onNotifyAssignedDoctorFromGuardian(
                  currentMother.id,
                  assignedDoctor,
                  postDraft || 'Severe distress shared in MomCircle community'
                );
                setDoctorNotifiedBanner(
                  `Priority check-in request sent directly to ${guardianAlert.assignedDoctorName} at ${guardianAlert.assignedDoctorHospital} and synced to Supabase!`
                );
              }}
              className="px-4 py-2.5 rounded-xl bg-[#5B3E85] hover:bg-[#49306B] text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs"
            >
              <Stethoscope className="w-4 h-4" />
              <span>
                Notify My Doctor ({guardianAlert.assignedDoctorName})
              </span>
            </button>

            <button
              type="button"
              data-testid="guardian-take-epds-btn"
              onClick={onOpenEpdsFromGuardian}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#FDFBF7] border border-[#5B3E85] text-[#5B3E85] text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>Take 2-Minute EPDS Self-Check</span>
            </button>
          </div>

          {doctorNotifiedBanner && (
            <div
              data-testid="guardian-notified-confirmation"
              className="p-3 rounded-xl bg-[#E3F2E6] border border-[#2E6F40]/30 text-xs font-semibold text-[#2E6F40] flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{doctorNotifiedBanner}</span>
            </div>
          )}
        </div>
      )}

      {/* Main 12-Col Grid: Channels Sidebar + Feed + 1-on-1 Peer Chat Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Topic Channels */}
        <div className="lg:col-span-3 bg-white border border-[#E6DFD3] rounded-2xl p-4 space-y-3 h-fit">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#5A625D] px-2">
            MomCircle Topic Channels
          </div>
          <div className="space-y-1">
            {CHANNELS.map((ch) => (
              <button
                key={ch.id}
                type="button"
                onClick={() => setSelectedChannel(ch.id)}
                className={`w-full p-2.5 rounded-xl text-left transition-colors flex flex-col gap-0.5 ${
                  selectedChannel === ch.id
                    ? 'bg-[#F4EFFA] text-[#5B3E85] border border-[#E2D6F3] font-semibold'
                    : 'text-[#3A403C] hover:bg-[#FDFBF7]'
                }`}
              >
                <span className="text-xs font-mono flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{ch.id.replace('#', '')}</span>
                </span>
                <span className="text-[11px] text-[#5A625D] line-clamp-1">{ch.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Center: Post Composer + Channel Feed */}
        <div className="lg:col-span-6 space-y-4">
          {/* Post Composer */}
          <form
            onSubmit={handlePublishPost}
            className="bg-white border border-[#E6DFD3] rounded-2xl p-5 space-y-3.5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-[#1F2421]">
                Posting in <span className="font-mono text-[#5B3E85]">{selectedChannel}</span>
              </span>

              <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#5B3E85] cursor-pointer bg-[#F4EFFA] px-3 py-1.5 rounded-xl border border-[#E2D6F3]">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded text-[#5B3E85]"
                />
                <EyeOff className="w-3.5 h-3.5" />
                <span>
                  {isAnonymous
                    ? 'Post as "Verified Mom • Gentle Lotus"'
                    : `Post as ${currentMother.name}`}
                </span>
              </label>
            </div>

            <textarea
              rows={3}
              data-testid="momcircle-post-input"
              value={postDraft}
              onChange={(e) => setPostDraft(e.target.value)}
              placeholder="Share how your night feed is going, ask a question, or vent safely..."
              className="w-full p-3.5 rounded-xl bg-[#FDFBF7] border border-[#E6DFD3] text-xs sm:text-sm text-[#1F2421] focus:outline-none focus:border-[#5B3E85]"
            />

            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-[#5A625D]">
                Protected by Dynamic AI Safety Guardian ({assignedDoctor.fullName})
              </span>
              <button
                type="submit"
                data-testid="momcircle-post-submit-btn"
                className="px-4 py-2 rounded-xl bg-[#5B3E85] hover:bg-[#49306B] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publish to MomCircle</span>
              </button>
            </div>
          </form>

          {/* Posts Feed */}
          <div className="space-y-3">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white border border-[#E6DFD3] rounded-2xl p-5 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-[#1F2421] flex items-center gap-2">
                      <span>{post.authorDisplayName}</span>
                      <span className="px-2 py-0.5 rounded bg-[#F4EFFA] text-[#5B3E85] text-[10px] font-mono">
                        {post.channel}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#5A625D]">{post.authorBadge}</div>
                  </div>
                  <span className="text-[11px] font-mono text-[#5A625D]">{post.timestamp}</span>
                </div>

                <p className="text-xs sm:text-sm text-[#1F2421] leading-relaxed">
                  {post.content}
                </p>

                <div className="flex items-center gap-3 pt-2 border-t border-[#E6DFD3]">
                  <button
                    type="button"
                    onClick={() => onLikePost(post.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#FFF5F5] hover:bg-[#FCE8E8] text-[#E11D48] text-xs font-semibold transition-colors"
                  >
                    <Heart className="w-3.5 h-3.5" />
                    <span>💜 {post.likes} Solidarity Likes</span>
                  </button>
                  <span className="text-xs text-[#5A625D]">
                    🤱 {post.hugReactions} Warm Hugs
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: 1-on-1 Peer Chat Drawer Synced Live to Supabase */}
        <div className="lg:col-span-3 bg-white border border-[#E6DFD3] rounded-2xl p-4 flex flex-col justify-between space-y-4 h-fit">
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-[#E6DFD3] pb-2.5">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#2E6F40]" />
                <h3 className="text-xs font-semibold text-[#1F2421]">
                  1-on-1 Verified Peer Chat
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#2E6F40]">Live Sync</span>
            </div>

            <div className="flex flex-wrap gap-1">
              {['Sneha Kulkarni (Week 9)', 'Priya Nair (Week 4)', 'Divya Gowda (Week 5)'].map(
                (peer) => (
                  <button
                    key={peer}
                    type="button"
                    onClick={() => setActivePeerName(peer)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                      activePeerName === peer
                        ? 'bg-[#2E6F40] text-white'
                        : 'bg-[#F7F2EB] text-[#4A524D]'
                    }`}
                  >
                    {peer.split(' ')[0]}
                  </button>
                )
              )}
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto py-2">
              {peerMessages.map((pm) => (
                <div
                  key={pm.id}
                  className="p-2.5 rounded-xl bg-[#FDFBF7] border border-[#E6DFD3] text-xs space-y-1"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#5A625D]">
                    <span className="font-semibold text-[#2E6F40]">{pm.fromMotherName}</span>
                    <span>{pm.timestamp}</span>
                  </div>
                  <p className="text-[#1F2421]">{pm.text}</p>
                </div>
              ))}
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!peerChatDraft.trim()) return;
              onSendPeerMessage(activePeerName, peerChatDraft.trim());
              setPeerChatDraft('');
            }}
            className="flex gap-1.5 pt-2 border-t border-[#E6DFD3]"
          >
            <input
              type="text"
              value={peerChatDraft}
              onChange={(e) => setPeerChatDraft(e.target.value)}
              placeholder={`Message ${activePeerName.split(' ')[0]}...`}
              className="flex-1 px-2.5 py-1.5 rounded-xl bg-[#FDFBF7] border border-[#E6DFD3] text-xs text-[#1F2421] focus:outline-none focus:border-[#2E6F40]"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-[#2E6F40] text-white text-xs font-semibold"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
