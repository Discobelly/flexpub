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

  // Trigger modal when user scrolls, regardless of filtered results
  useEffect(() => {
    const handleScroll = () => {
      if (hasSeenModal) return;
      
      const scrollPosition = window.scrollY;
      
      // Show modal after user has scrolled down 800px (past the header and some content)
      if (scrollPosition > 800) {
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

  const FREE_MATCHES_PER_MONTH = 5;

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
    // Show waitlist modal for demo - all match requests go to waitlist
    setShowWaitlistModal(true);
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
              <div className="text-right">
                <p className="text-sm text-white/80">Match Requests</p>
                <p className="text-2xl font-bold" style={{color: '#f6ae2d'}}>
                  {FREE_MATCHES_PER_MONTH - freeMatchesUsed}
                  <span className="text-sm text-white/60 ml-1">remaining</span>
                </p>
                <p className="text-xs text-white/60">Resets monthly</p>
              </div>
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

        {/* Bulletin Board Demo Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" style={{color: '#456b7a'}} />
              <h2 className="text-lg font-semibold text-gray-900">Research Bulletin Board</h2>
            </div>
            <button 
              onClick={() => setShowWaitlistModal(true)}
              className="px-4 py-2 text-white rounded-lg font-medium text-sm shadow-md hover:opacity-90 transition-opacity" 
              style={{backgroundColor: '#f6ae2d'}}
            >
              + Post Request
            </button>
          </div>

          {/* Filter Pills - Show transparency features */}
          <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-gray-200">
            <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-medium text-gray-700 transition-colors">
              All Projects
            </button>
            <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-medium text-gray-700 transition-colors flex items-center gap-1">
              <span>💰</span> Paid Only
            </button>
            <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-medium text-gray-700 transition-colors flex items-center gap-1">
              <span>✍️</span> Authorship
            </button>
            <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-medium text-gray-700 transition-colors flex items-center gap-1">
              <span>🔬</span> Specialty
            </button>
            <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-medium text-gray-700 transition-colors flex items-center gap-1">
              <span>⏱️</span> Timeframe
            </button>
          </div>
          
          <div className="space-y-3">
            {/* Demo Post 1 - With transparent badges */}
            <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{backgroundColor: '#456b7a'}}>
                    JK
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Looking for biostatistics expert</p>
                    <p className="text-xs text-gray-500">MS4 • Cardiology • 2h ago</p>
                  </div>
                </div>
              </div>

              {/* Transparent badges */}
              <div className="flex flex-wrap gap-2 mb-3 ml-13">
                <span className="px-2 py-1 bg-green-50 border border-green-200 text-green-700 text-xs font-medium rounded-md flex items-center gap-1">
                  <span>💰</span> $30/hr
                </span>
                <span className="px-2 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium rounded-md flex items-center gap-1">
                  <span>✍️</span> Middle author
                </span>
                <span className="px-2 py-1 bg-purple-50 border border-purple-200 text-purple-700 text-xs font-medium rounded-md flex items-center gap-1">
                  <span>🔬</span> Cardiology
                </span>
                <span className="px-2 py-1 bg-orange-50 border border-orange-200 text-orange-700 text-xs font-medium rounded-md flex items-center gap-1">
                  <span>⏱️</span> 10 hrs/wk, 3 mo
                </span>
              </div>

              <p className="text-sm text-gray-700 ml-13">
                Need help with power analysis and regression modeling for heart failure outcomes study. R programming required.
              </p>
            </div>

            {/* Demo Post 2 - Different compensation model */}
            <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{backgroundColor: '#456b7a'}}>
                    SC
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Systematic review - need literature screener</p>
                    <p className="text-xs text-gray-500">Resident • Oncology • 5h ago</p>
                  </div>
                </div>
              </div>

              {/* Transparent badges */}
              <div className="flex flex-wrap gap-2 mb-3 ml-13">
                <span className="px-2 py-1 bg-gray-50 border border-gray-300 text-gray-700 text-xs font-medium rounded-md flex items-center gap-1">
                  <span>🎓</span> Unpaid
                </span>
                <span className="px-2 py-1 bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs font-medium rounded-md flex items-center gap-1">
                  <span>⭐</span> First author
                </span>
                <span className="px-2 py-1 bg-purple-50 border border-purple-200 text-purple-700 text-xs font-medium rounded-md flex items-center gap-1">
                  <span>🔬</span> Oncology
                </span>
                <span className="px-2 py-1 bg-orange-50 border border-orange-200 text-orange-700 text-xs font-medium rounded-md flex items-center gap-1">
                  <span>⏱️</span> 5-8 hrs/wk, 4 mo
                </span>
              </div>

              <p className="text-sm text-gray-700 ml-13">
                Great opportunity for first publication. Training provided on systematic review methodology. No prior experience needed.
              </p>
            </div>
          </div>

          {/* Info note about transparency */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-600 text-center">
              Every project shows <span className="font-semibold" style={{color: '#456b7a'}}>payment, authorship, specialty & timeframe</span> upfront. No surprises.
            </p>
          </div>
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProfiles.slice(0, 4).map(profile => {
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
                          Request Match
                        </>
                      ) : (
                        <>
                          <DollarSign className="w-4 h-4" />
                          Request Match ($5)
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Blur overlay with close on click */}
          <div 
            className="absolute inset-0 bg-black/60"
            style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
            onClick={() => setShowWaitlistModal(false)}
          ></div>
          
          {/* Modal - centered and compact with max-height for small screens */}
          <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            
            {/* Modal header section - Dusky Blue #456b7a - more compact */}
            <div className="px-8 pt-8 pb-6 relative" style={{backgroundColor: '#456b7a'}}>
              <button
                onClick={() => setShowWaitlistModal(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{backgroundColor: '#f6ae2d'}}>
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Join FlexPub</h2>
              </div>
              <p className="text-white/90 text-sm">
                Connect with future collaborators and mentors for free. Get productive. Privacy ensured.
              </p>
            </div>

            {/* Form section - More compact spacing */}
            <div className="px-8 py-6 bg-white">
              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  console.log('🔵 Form submission started');
                  
                  const formData = {
                    name: e.target.elements['name'].value,
                    email: e.target.elements['email'].value,
                    university: e.target.elements['university'].value,
                    position: e.target.elements['position'].value
                  };
                  
                  console.log('📝 Form data:', formData);
                  
                  try {
                    const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxiVOFYgXlDuEXBO-sVmuFVcztLBZRnVX-9bZxP3RTuLGMkCSxXDnqOif8NiWAosIjoDw/exec';
                    
                    console.log('🚀 Sending to Google Sheets...');
                    const response = await fetch(APPS_SCRIPT_URL, {
                      method: 'POST',
                      mode: 'no-cors',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(formData)
                    });
                    
                    console.log('✅ Submission successful!');
                    
                    // Close modal
                    setShowWaitlistModal(false);
                    e.target.reset();
                    
                    // Show modern toast notification
                    const toast = document.createElement('div');
                    toast.innerHTML = `
                      <div style="position: fixed; top: 24px; right: 24px; background: white; border-left: 4px solid #f6ae2d; padding: 16px 20px; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.12); z-index: 9999; max-width: 380px; animation: slideIn 0.3s ease-out;">
                        <div style="display: flex; align-items: start; gap: 12px;">
                          <div style="background: #f6ae2d; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          <div style="flex: 1;">
                            <div style="font-weight: 600; color: #111827; margin-bottom: 4px; font-size: 15px;">You're on the list!</div>
                            <div style="font-size: 14px; color: #6b7280; line-height: 1.4;">We'll be in touch soon with early access.</div>
                          </div>
                        </div>
                      </div>
                      <style>
                        @keyframes slideIn {
                          from {
                            transform: translateX(400px);
                            opacity: 0;
                          }
                          to {
                            transform: translateX(0);
                            opacity: 1;
                          }
                        }
                      </style>
                    `;
                    document.body.appendChild(toast);
                    setTimeout(() => {
                      toast.style.transition = 'all 0.3s ease-out';
                      toast.style.transform = 'translateX(400px)';
                      toast.style.opacity = '0';
                      setTimeout(() => toast.remove(), 300);
                    }, 4500);
                    
                  } catch (error) {
                    console.error('❌ Submission error:', error);
                    setShowWaitlistModal(false);
                    e.target.reset();
                    
                    // Show toast even on error (data likely still sent due to no-cors)
                    const toast = document.createElement('div');
                    toast.innerHTML = `
                      <div style="position: fixed; top: 24px; right: 24px; background: white; border-left: 4px solid #f6ae2d; padding: 16px 20px; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.12); z-index: 9999; max-width: 380px; animation: slideIn 0.3s ease-out;">
                        <div style="display: flex; align-items: start; gap: 12px;">
                          <div style="background: #f6ae2d; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          <div style="flex: 1;">
                            <div style="font-weight: 600; color: #111827; margin-bottom: 4px; font-size: 15px;">You're on the list!</div>
                            <div style="font-size: 14px; color: #6b7280; line-height: 1.4;">We'll be in touch soon with early access.</div>
                          </div>
                        </div>
                      </div>
                      <style>
                        @keyframes slideIn {
                          from {
                            transform: translateX(400px);
                            opacity: 0;
                          }
                          to {
                            transform: translateX(0);
                            opacity: 1;
                          }
                        }
                      </style>
                    `;
                    document.body.appendChild(toast);
                    setTimeout(() => {
                      toast.style.transition = 'all 0.3s ease-out';
                      toast.style.transform = 'translateX(400px)';
                      toast.style.opacity = '0';
                      setTimeout(() => toast.remove(), 300);
                    }, 4500);
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Academic Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="you@university.edu"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all placeholder:text-gray-400"
                  />
                  <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-yellow-500" />
                    Academic profile will be verified
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">University</label>
                  <input
                    type="text"
                    name="university"
                    required
                    placeholder="Your university name"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Academic Position</label>
                  <select
                    name="position"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                  >
                    <option value="">Select your position</option>
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Graduate student">Graduate student</option>
                    <option value="Medical student">Medical student</option>
                    <option value="Resident">Resident</option>
                    <option value="Attending/faculty">Attending/faculty</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:opacity-90 text-base mt-4"
                  style={{backgroundColor: '#f6ae2d'}}
                >
                  Get Early Access →
                </button>
                
                <p className="text-xs text-gray-400 text-center mt-3">
                  Join 500+ researchers on the waitlist
                </p>
              </form>
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
                      }}
                      className="flex-1 px-4 py-3 bg-blue-600 text-gray-900 font-bold hover:bg-blue-700 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      <Heart className="w-5 h-5" />
                      Send Match Request
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
                We know finding research opportunities is hard – often unpaid, rarely offering authorship, and unclear from the start. 
                FlexPub changes this. Every opportunity shows <strong>payment, authorship, time commitment, and required skills upfront</strong>. 
                No surprises. No wasted time. Just transparent collaboration.
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
                You control how much you share. Show your full name or just initials. Share your specific university or just the tier (Top 10, Top 50, etc.). Full contact details are only revealed after you both match.
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
                  <p><strong>Browse transparent opportunities</strong> – see payment, authorship, time commitment, and skills needed upfront</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0 text-blue-800 font-bold text-xs">2</div>
                  <p><strong>Send match requests</strong> – you get <strong>5 free match requests per month</strong> to connect with the right collaborators</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0 text-blue-800 font-bold text-xs">3</div>
                  <p><strong>Connect and collaborate</strong> – when both parties accept, full contact details are revealed and you can start working together</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-700">
                  <strong>Simple pricing:</strong> Free to browse and match. Researchers can pay to feature their project listings for more visibility.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 border-t border-gray-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-600">
            Questions? Email us at{' '}
            <a 
              href="mailto:hello.flexpub@gmail.com" 
              className="font-medium hover:underline"
              style={{color: '#456b7a'}}
            >
              hello.flexpub@gmail.com
            </a>
          </p>
          <p className="text-xs text-gray-400 mt-2">
            © 2026 FlexPub. Built for researchers, by researchers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResearchMatchPlatform;