import React, { useState, useEffect } from 'react';
import { Search, Users, BookOpen, GraduationCap, Award, DollarSign, Filter, X, Lock, CheckCircle, Crown, Zap, Heart } from 'lucide-react';
import { demoProfiles } from '../data/demoProfiles';

const ResearchMatchPlatform = () => {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [filters, setFilters] = useState({
    level: '',
    specialty: '',
    hasPublications: false,
    institutionTier: '',
    region: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [matchedProfiles, setMatchedProfiles] = useState([]);
  const [userTier, setUserTier] = useState('free'); // 'free' or 'premium'
  const [freeMatchesUsed, setFreeMatchesUsed] = useState(0);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [hasSeenModal, setHasSeenModal] = useState(false);

  // Trigger modal when user scrolls near bottom
  useEffect(() => {
    const handleScroll = () => {
      if (hasSeenModal) return;
      
      const scrollPosition = window.scrollY + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;
      
      // When user scrolls 80% down the page, show modal
      if (scrollPosition > pageHeight * 0.8) {
        setShowWaitlistModal(true);
        setHasSeenModal(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasSeenModal]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showWaitlistModal) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [showWaitlistModal]);

  // Use imported demo profiles
  const profiles = demoProfiles;

  const specialties = [
    "Anesthesiology", "Cardiology", "Critical Care", "Dermatology", "Emergency Medicine",
    "Endocrinology", "Family Medicine", "Gastroenterology", "General Surgery", "Geriatrics",
    "Hematology", "Infectious Disease", "Internal Medicine", "Nephrology", "Neurology",
    "Neurosurgery", "Obstetrics & Gynecology", "Oncology", "Ophthalmology", "Orthopedic Surgery",
    "Otolaryngology (ENT)", "Pathology", "Pediatrics", "Physical Medicine & Rehabilitation",
    "Plastic Surgery", "Psychiatry", "Pulmonology", "Radiology", "Rheumatology", "Urology",
    "Bioengineering", "Biomedical Sciences", "Epidemiology", "Genetics", "Immunology",
    "Neuroscience", "Pharmacology", "Public Health", "Unicorn Engineering"
  ];
  
  const institutionTiers = [
    "Top 5 Medical School (US)", 
    "Top 10 Medical School (US)", 
    "Top 20 Medical School (US)",
    "Top 50 Medical School (US)",
    "US Medical School",
    "Top 10 University (US)", 
    "Top 50 University (US)",
    "US University",
    "Russell Group University (UK)",
    "Oxbridge (UK)",
    "Canadian University",
    "European University",
    "Australian University",
    "Asian University",
    "Top Research Institution (International)",
    "International University"
  ];
  
  const regions = [
    "Northeast US",
    "Southeast US", 
    "Midwest US",
    "Southwest US",
    "West Coast US",
    "Canada",
    "United Kingdom",
    "Europe",
    "Asia",
    "Australia/Oceania",
    "Latin America",
    "Middle East",
    "Africa"
  ];
  
  const levels = ["Undergraduate", "Medical Student", "Resident", "Attending/Faculty"];

  const FREE_MATCHES_PER_MONTH = 3;

  const canSendFreeMatch = () => {
    return freeMatchesUsed < FREE_MATCHES_PER_MONTH;
  };

  const isPremium = userTier === 'premium';

  const getFilteredProfiles = () => {
    return profiles.filter(profile => {
      if (filters.level && profile.level !== filters.level) return false;
      if (filters.specialty && profile.specialty !== filters.specialty) return false;
      if (filters.hasPublications && profile.publications === 0) return false;
      if (filters.institutionTier && profile.institutionTier !== filters.institutionTier) return false;
      if (filters.region && profile.region !== filters.region) return false;
      return true;
    });
  };

  const handleMatch = (profile) => {
    if (!matchedProfiles.find(p => p.id === profile.id)) {
      setMatchedProfiles([...matchedProfiles, profile]);
      
      if (isPremium || canSendFreeMatch()) {
        if (!isPremium) {
          setFreeMatchesUsed(freeMatchesUsed + 1);
        }
        alert(`Match request sent to ${profile.displayName}! They'll be notified and can accept or decline. ${!isPremium && freeMatchesUsed + 1 < FREE_MATCHES_PER_MONTH ? `You have ${FREE_MATCHES_PER_MONTH - freeMatchesUsed - 1} free matches remaining this month.` : ''}`);
      } else {
        alert(`Match request sent to ${profile.displayName}! This match costs $5 since you've used your 3 free matches this month. Payment will be processed upon mutual match.`);
      }
    } else {
      alert(`You've already matched with ${profile.displayName}!`);
    }
  };

  const isMatched = (profileId) => {
    return matchedProfiles.find(p => p.id === profileId);
  };

  const filteredProfiles = getFilteredProfiles();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="shadow-sm border-b border-gray-200" style={{backgroundColor: '#456b7a'}}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg shadow-lg" style={{backgroundColor: '#f6ae2d'}}>
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">FlexPub</h1>
                <p className="text-sm text-white/80">Find Your Co-Author</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              {!isPremium && (
                <div className="text-right">
                  <p className="text-sm text-white/80">Free Matches</p>
                  <p className="text-2xl font-bold" style={{color: '#f6ae2d'}}>
                    {FREE_MATCHES_PER_MONTH - freeMatchesUsed}
                    <span className="text-sm text-white/60 ml-1">remaining</span>
                  </p>
                  <p className="text-xs text-white/60">Resets monthly</p>
                </div>
              )}
              {isPremium && (
                <div className="px-4 py-2 text-white rounded-lg font-medium flex items-center gap-2 shadow-lg" style={{backgroundColor: '#f6ae2d'}}>
                  <Zap className="w-4 h-4 text-white" />
                  Premium Member
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-gray-600">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-semibold">Filters:</span>
            </div>

            <select
              value={filters.level}
              onChange={(e) => setFilters({...filters, level: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Levels</option>
              {levels.map(level => <option key={level} value={level}>{level}</option>)}
            </select>

            <select
              value={filters.specialty}
              onChange={(e) => setFilters({...filters, specialty: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Specialties</option>
              {specialties.map(spec => <option key={spec} value={spec}>{spec}</option>)}
            </select>

            <select
              value={filters.institutionTier}
              onChange={(e) => setFilters({...filters, institutionTier: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Tiers</option>
              {institutionTiers.map(tier => <option key={tier} value={tier}>{tier}</option>)}
            </select>

            <select
              value={filters.region}
              onChange={(e) => setFilters({...filters, region: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Regions</option>
              {regions.map(region => <option key={region} value={region}>{region}</option>)}
            </select>

            <label className="flex items-center gap-2 cursor-pointer px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                checked={filters.hasPublications}
                onChange={(e) => setFilters({...filters, hasPublications: e.target.checked})}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Has Publications</span>
            </label>

            {(filters.level || filters.specialty || filters.institutionTier || filters.region || filters.hasPublications) && (
              <button
                onClick={() => setFilters({ level: '', specialty: '', hasPublications: false, institutionTier: '', region: '' })}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-2"
              >
                Clear All
              </button>
            )}

            <div className="ml-auto text-sm text-gray-600">
              {filteredProfiles.length} researchers
            </div>
          </div>
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProfiles.slice(0, 8).map(profile => {
            const matched = isMatched(profile.id);
            return (
              <div key={profile.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg" style={{backgroundColor: '#456b7a'}}>
                      {profile.displayName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-gray-900">{profile.displayName}</h3>
                        {profile.verified && (
                          <CheckCircle className="w-5 h-5 text-blue-500" title="Verified Profile" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{profile.level} • {profile.year}</p>
                    </div>
                  </div>
                  {profile.publications > 0 && (
                    <div className="flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full">
                      <Award className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-semibold text-green-700">{profile.publications} Pubs</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    {matched ? (
                      <div className="flex items-center gap-2 text-gray-700">
                        <GraduationCap className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{profile.institution}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Lock className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{profile.institutionTier}</span>
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">• {profile.region}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Search className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">{profile.specialty}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">{profile.bio}</p>

                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Research Interests:</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 bg-yellow-50 text-yellow-700 text-xs rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {matched && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <p className="text-sm font-medium text-green-800">Match Confirmed! Full details unlocked.</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setSelectedProfile(profile)}
                    className="flex-1 px-4 py-2 border border-yellow-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm"
                  >
                    View Profile
                  </button>
                  {matched ? (
                    <button
                      className="flex-1 px-4 py-2 bg-green-600 text-gray-900 font-bold rounded-lg font-medium text-sm flex items-center justify-center gap-2 cursor-default"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Matched
                    </button>
                  ) : (
                    <button
                      onClick={() => handleMatch(profile)}
                      className="flex-1 px-4 py-2 text-white rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-md hover:opacity-90"
                      style={{backgroundColor: '#f6ae2d'}}
                    >
                      {isPremium || canSendFreeMatch() ? (
                        <>
                          <Heart className="w-4 h-4" />
                          Match {!isPremium && `(${FREE_MATCHES_PER_MONTH - freeMatchesUsed} free)`}
                        </>
                      ) : (
                        <>
                          <DollarSign className="w-4 h-4" />
                          Match ($5)
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredProfiles.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No researchers found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more results</p>
          </div>
        )}
      </div>

      {/* Sleek Modern Waitlist Modal with Working Blur */}
      {showWaitlistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
          {/* Blur overlay - darker, no click to close */}
          <div 
            className="absolute inset-0 bg-black/60"
            style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
          ></div>
          
          {/* Modal - centered and compact, NO X BUTTON */}
          <div className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl z-10 overflow-hidden">
            
            {/* Modal header section - Dusky Blue #456b7a */}
            <div className="px-10 pt-16 pb-10 text-center" style={{backgroundColor: '#456b7a'}}>
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl" style={{backgroundColor: '#f6ae2d'}}>
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-3">Join FlexPub</h2>
              <p className="text-white/90 text-lg">
                Connect with future collaborators and mentors for free. Get productive. Privacy ensured.
              </p>
            </div>

            {/* Form section - Embedded Google Form */}
            <div className="px-10 py-10 bg-white">
              <iframe 
                src="https://docs.google.com/forms/d/e/1FAIpQLSeTautinqrGvbxxB1c-3GBgZKqg5wx4D_tW4UkqncDyNFuPeQ/viewform?embedded=true"
                width="100%" 
                height="520"
                frameBorder="0" 
                marginHeight="0" 
                marginWidth="0"
                className="rounded-lg"
              >
                Loading…
              </iframe>
              
              <p className="text-xs text-gray-400 text-center mt-5">
                Join 500+ researchers on the waitlist
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-gray-900 font-bold text-2xl font-bold">
                    {selectedProfile.displayName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {isMatched(selectedProfile.id) ? selectedProfile.fullName : selectedProfile.displayName}
                      </h2>
                      {selectedProfile.verified && (
                        <CheckCircle className="w-6 h-6 text-blue-500" title="Verified Profile" />
                      )}
                    </div>
                    <p className="text-gray-600">{selectedProfile.level} • {selectedProfile.year}</p>
                    {isMatched(selectedProfile.id) ? (
                      <p className="text-sm text-gray-700 font-medium mt-1">{selectedProfile.institution}</p>
                    ) : (
                      <div className="flex items-center gap-2 mt-1">
                        <Lock className="w-4 h-4 text-gray-400" />
                        <p className="text-sm text-gray-600">{selectedProfile.institutionTier} • {selectedProfile.region}</p>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProfile(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {!isMatched(selectedProfile.id) && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-yellow-900 mb-1">Privacy Protected</p>
                      <p className="text-xs text-yellow-800">
                        Full name and exact institution will be revealed after matching. This protects both parties' privacy.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">About</h3>
                  <p className="text-gray-700">{selectedProfile.bio}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Specialty Focus</h3>
                  <p className="text-gray-700">{selectedProfile.specialty}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Research Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProfile.interests.map((interest, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Skills & Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProfile.skills.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 bg-yellow-50 text-yellow-700 text-sm rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Previous Projects</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {selectedProfile.previousProjects.map((project, idx) => (
                      <li key={idx}>{project}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Publications</p>
                      <p className="text-2xl font-bold text-gray-900">{selectedProfile.publications}</p>
                    </div>
                    <Award className="w-12 h-12 text-blue-600" />
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setSelectedProfile(null)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Close
                  </button>
                  {isMatched(selectedProfile.id) ? (
                    <button
                      className="flex-1 px-4 py-3 bg-green-600 text-gray-900 font-bold rounded-lg font-medium flex items-center justify-center gap-2 cursor-default"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Already Matched
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        handleMatch(selectedProfile);
                        setSelectedProfile(null);
                      }}
                      className="flex-1 px-4 py-3 bg-blue-600 text-gray-900 font-bold hover:bg-blue-700 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      {isPremium || canSendFreeMatch() ? (
                        <>
                          <Heart className="w-5 h-5" />
                          Send Match Request
                        </>
                      ) : (
                        <>
                          <DollarSign className="w-5 h-5" />
                          Send Match Request ($5)
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Banners */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
        {/* Mission Statement */}
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Heart className="w-6 h-6 text-gray-900 font-bold" />
            </div>
            <div>
              <h3 className="font-semibold text-yellow-900 mb-2">Built for Researchers, By Researchers</h3>
              <p className="text-sm text-yellow-800">
                We know research collaboration shouldn't break the bank. That's why <strong>matching is free</strong> for everyone. 
                Our mission is to help the next generation of clinicians and scientists build meaningful research partnerships.
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Lock className="w-6 h-6 text-gray-900 font-bold" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Privacy First</h3>
              <p className="text-sm text-blue-800">
                Your privacy matters. Until you match, profiles show only first name or initials, institution tier (not specific school), and region. Full details unlock only after mutual matching.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="bg-gray-700 p-2 rounded-lg">
              <Users className="w-6 h-6 text-gray-900 font-bold" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-3">How Matching Works</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0 text-blue-800 font-bold text-xs">1</div>
                  <p><strong>Browse profiles</strong> and filter by specialty, institution tier, publication history, and more</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0 text-blue-800 font-bold text-xs">2</div>
                  <p><strong>Send a match request</strong> – you get <strong>3 free matches per month</strong>, no credit card required</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0 text-blue-800 font-bold text-xs">3</div>
                  <p><strong>Connect!</strong> When both parties accept, full contact info is revealed and you can start collaborating</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 mb-3">
                  <strong>Need more matches?</strong> Additional matches after your 3 free ones are just $5 each. Or upgrade to Premium for unlimited matching plus other conveniences.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 bg-white rounded border border-gray-200">
                    <p className="font-semibold text-gray-900 text-sm mb-2">Free (Always)</p>
                    <ul className="text-xs text-gray-700 space-y-1">
                      <li>✓ 3 matches/month</li>
                      <li>✓ Browse all profiles</li>
                      <li>✓ Basic filters</li>
                      <li>✓ Full messaging</li>
                      <li>• Extra matches: $5 each</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded border-2 border-yellow-300">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-blue-600" />
                      <p className="font-semibold text-gray-900 text-sm">Premium - $19/month</p>
                    </div>
                    <ul className="text-xs text-gray-700 space-y-1">
                      <li>✓ <strong>Unlimited matches</strong></li>
                      <li>✓ Advanced search filters</li>
                      <li>✓ See who viewed you</li>
                      <li>✓ Priority support</li>
                      <li>✓ Featured profile</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchMatchPlatform;