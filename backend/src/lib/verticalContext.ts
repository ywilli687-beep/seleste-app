// backend/src/lib/verticalContext.ts

export interface VerticalContext {
  customerType:     string
  trustSignals:     string[]
  keywordPatterns:  string[]
  avgTicketLow:     number
  avgTicketHigh:    number
  fears:            string[]
  ctaLanguage:      string[]
  competitors:      string
  conversionMoment: string
  reviewPlatforms:  string[]
  neverMention:     string[]
  insightFraming: {
    seo:         string
    conversion:  string
    reputation:  string
    content:     string
    trust:       string
    local:       string
    technical:   string
    mobile:      string
    performance: string
  }
}

export const VERTICAL_CONTEXT: Record<string, VerticalContext> = {

  AUTO_REPAIR: {
    customerType:     'car owners needing repairs, maintenance, or diagnostics',
    trustSignals:     ['ASE certifications', 'Google reviews', 'warranties on parts and labour', 'BBB accreditation', 'years in business'],
    keywordPatterns:  ['auto repair near me', 'oil change [city]', 'brake repair [city]', 'check engine light [city]', '[make] mechanic [city]'],
    avgTicketLow:     280,
    avgTicketHigh:    850,
    fears:            ['being overcharged', 'unnecessary repairs', 'work not done right', 'being without a car'],
    ctaLanguage:      ['Schedule a repair', 'Get a free estimate', 'Book your service', 'Call us today'],
    competitors:      'other local shops, dealership service departments, and national chains like Jiffy Lube and Midas',
    conversionMoment: 'a phone call or online booking for a service appointment',
    reviewPlatforms:  ['Google', 'Yelp', 'CarTalk'],
    neverMention:     ['patients', 'clients', 'legal', 'medical', 'court', 'prescription', 'attorney', 'counsel'],
    insightFraming: {
      seo:        'Car owners search for a mechanic the moment something goes wrong — usually from their phone, often from a parking lot. If your shop does not appear in the top 3 local results, that job goes to a competitor.',
      conversion:  'Someone landed on your site because they need their car fixed. Every extra click, missing phone number, or unclear service list costs you a booking.',
      reputation:  'Car repair is a high-anxiety purchase. Customers read reviews before they call anyone. A shop with fewer than 20 reviews or a rating below 4.3 gets scrolled past.',
      content:     'Explaining what you fix, what it costs, and how long it takes removes the fear of the unknown — the #1 reason people delay getting their car repaired.',
      trust:       'Displaying ASE certifications, warranties, and your years in business tells a nervous customer you will not rip them off.',
      local:       'Your Google Business Profile is your most important marketing asset. Incomplete hours, missing photos, or no response to reviews is costing you calls every day.',
      technical:   'A slow or broken website on mobile means the person standing next to a broken-down car just called someone else.',
      mobile:      'Over 70% of auto repair searches happen on mobile. If your site is not fast and easy to use on a phone, you are invisible to most of your potential customers.',
      performance: 'If your site takes more than 3 seconds to load, most mobile visitors leave. In auto repair, that is a lost job worth hundreds of dollars.',
    },
  },

  DENTAL: {
    customerType:     'patients searching for a dentist for routine care, cosmetic work, or urgent pain relief',
    trustSignals:     ['credentials and board certifications', 'before and after photos', 'insurance accepted list', 'patient reviews', 'years of experience'],
    keywordPatterns:  ['dentist near me', 'family dentist [city]', 'teeth whitening [city]', 'emergency dentist [city]', 'dental implants [city]'],
    avgTicketLow:     180,
    avgTicketHigh:    3200,
    fears:            ['pain', 'cost', 'being judged for dental hygiene', 'unexpected bills', 'long wait times'],
    ctaLanguage:      ['Book an appointment', 'Request a consultation', 'New patient special', 'Call our office'],
    competitors:      'other local dental practices and corporate chains like Aspen Dental',
    conversionMoment: 'a new patient appointment booking or a phone call to the front desk',
    reviewPlatforms:  ['Google', 'Healthgrades', 'Zocdoc', 'Yelp'],
    neverMention:     ['customers', 'buyers', 'shoppers', 'car', 'vehicle', 'legal', 'attorney', 'inventory'],
    insightFraming: {
      seo:        'Patients choose a dentist within 5 miles of home or work. If your practice does not rank in the local 3-pack for "dentist near me," you are invisible to the patients most likely to stay long-term.',
      conversion:  'A patient who found your site is already considering you. Missing insurance information, no online booking, or a confusing services list sends them to the next result.',
      reputation:  'Dental anxiety is real. Patients read 10+ reviews before booking. A practice with fewer than 30 reviews or anything below 4.4 stars loses new patients to competitors daily.',
      content:     'Patients want to know exactly what to expect — what you offer, what it costs, what your office looks like, and whether you accept their insurance. Every unanswered question is a booking lost.',
      trust:       'Displaying your credentials, certifications, and team photos builds the personal connection patients need before they trust someone with their mouth.',
      local:       'Your Google Business Profile drives more new patient calls than your website. Incomplete profiles, missing hours, and unanswered reviews are turning patients away before they ever visit your site.',
      technical:   'Patients searching for a dentist in pain or urgency will not wait for a slow site to load. Technical issues are costing you your highest-value emergency appointments.',
      mobile:      'Most dental searches happen on mobile. A site that is hard to navigate on a phone means patients cannot find your number or book online — so they call the next practice.',
      performance: 'A slow-loading site signals an outdated practice. In a high-trust category like dentistry, first impressions on your website directly affect whether a patient books.',
    },
  },

  RESTAURANT: {
    customerType:     'diners searching for a place to eat — for date nights, family meals, business lunches, or takeout',
    trustSignals:     ['Google and Yelp reviews', 'professional food photos', 'visible menu with prices', 'health inspection score', 'social media presence'],
    keywordPatterns:  ['restaurants near me', '[cuisine] restaurant [city]', 'best [food type] [city]', 'dinner [city]', 'takeout [city]'],
    avgTicketLow:     28,
    avgTicketHigh:    85,
    fears:            ['bad food', 'poor service', 'not worth the money', 'long wait', "can't see menu before going"],
    ctaLanguage:      ['Reserve a table', 'Order online', 'View menu', 'Make a reservation'],
    competitors:      'every other restaurant within 2 miles and delivery apps like DoorDash and Uber Eats',
    conversionMoment: 'a reservation, an online order, or a walk-in driven by online discovery',
    reviewPlatforms:  ['Google', 'Yelp', 'TripAdvisor', 'OpenTable'],
    neverMention:     ['patients', 'clients', 'legal', 'medical', 'attorney', 'vehicle', 'car', 'inventory'],
    insightFraming: {
      seo:        'Hungry people make fast decisions. If your restaurant does not appear when someone searches "dinner near me" or "[your cuisine] [city]," they are eating somewhere else tonight.',
      conversion:  'A diner who lands on your site is ready to commit. No online menu, no reservation button, or slow-loading photos means they open the next tab.',
      reputation:  'Reviews are the menu for trust. Restaurants with fewer than 50 Google reviews or a rating below 4.2 get skipped in favour of competitors with more social proof.',
      content:     'Your menu is your most important piece of content. Outdated items, missing prices, and no photos of your food cost you reservations every single day.',
      trust:       'Professional food photography, a visible health rating, and responses to reviews tell a potential diner this is a place worth their money and their evening.',
      local:       'Your Google Business Profile photo gallery is your free billboard. Restaurants with 20+ photos get 35% more clicks than those with fewer than 5.',
      technical:   'A broken reservation link or a menu that will not load on mobile means a lost booking — often a table of 4 worth $200+ on a Friday night.',
      mobile:      'Over 80% of restaurant searches happen on mobile, often in the moment. Your site needs to show your menu, location, and booking option within two taps.',
      performance: "Hungry people are impatient. A 4-second load time on your menu page costs you diners who opened your competitor's site while yours was still loading.",
    },
  },

  PLUMBING: {
    customerType:     'homeowners and property managers with plumbing problems — from leaks and clogs to full installations',
    trustSignals:     ['licensing and insurance badges', 'Google reviews', 'upfront pricing', 'same-day availability', 'years in business'],
    keywordPatterns:  ['plumber near me', 'emergency plumber [city]', 'water heater repair [city]', 'drain cleaning [city]', 'licensed plumber [city]'],
    avgTicketLow:     180,
    avgTicketHigh:    3500,
    fears:            ['being overcharged', 'unlicensed work', 'making the problem worse', 'not available when needed'],
    ctaLanguage:      ['Call now', 'Get a free quote', 'Book a plumber', 'Emergency service available'],
    competitors:      'other local plumbers and national franchises like Roto-Rooter',
    conversionMoment: 'a phone call — plumbing is almost always booked by phone, often urgently',
    reviewPlatforms:  ['Google', 'Yelp', 'Angi', 'HomeAdvisor'],
    neverMention:     ['patients', 'clients', 'legal', 'medical', 'attorney', 'vehicle', 'car', 'dine'],
    insightFraming: {
      seo:        'A burst pipe or a backed-up drain is an emergency. Homeowners search, find the first trusted result, and call immediately. If your business is not in the top 3, you do not get that call.',
      conversion:  'Someone with a plumbing problem wants one thing: a phone number they can call right now. Every barrier between landing on your site and dialling costs you a job.',
      reputation:  'Homeowners let a stranger into their house. They read reviews carefully. A plumber with fewer than 25 reviews or anything below 4.3 stars loses jobs to more reviewed competitors every day.',
      content:     'Listing your services, service area, and whether you handle emergencies removes the friction that makes anxious homeowners call someone else.',
      trust:       'Your license number, insurance proof, and years in business on your homepage tell a homeowner it is safe to let you in the door.',
      local:       'Plumbing is hyper-local. Your Google Business Profile service area, hours, and reviews are what show up when someone searches in your city. An incomplete profile means lost emergency calls.',
      technical:   "A plumber's website is often the first thing a panicking homeowner sees. If it loads slowly or breaks on mobile, they call someone else before you even know they existed.",
      mobile:      'Plumbing emergencies are searched on mobile, often in a wet basement or under a leaking sink. Your phone number needs to be one tap away at the top of the page.',
      performance: 'In an emergency, a slow site is a lost job. Plumbing customers will not wait — they will call the next result while your homepage is still loading.',
    },
  },

  HVAC: {
    customerType:     'homeowners and businesses needing heating, cooling, or air quality services',
    trustSignals:     ['NATE certification', 'manufacturer authorisation badges', 'Google reviews', 'financing options', 'warranty information'],
    keywordPatterns:  ['AC repair near me', 'HVAC company [city]', 'furnace repair [city]', 'air conditioning installation [city]', 'emergency HVAC [city]'],
    avgTicketLow:     220,
    avgTicketHigh:    12000,
    fears:            ['being without heat or AC', 'being oversold a new unit', 'unlicensed technicians', 'hidden fees'],
    ctaLanguage:      ['Schedule service', 'Get a free estimate', 'Emergency HVAC available', 'Book a tune-up'],
    competitors:      'other local HVAC companies and national brands like One Hour and ARS',
    conversionMoment: 'a service call booking or a quote request for installation',
    reviewPlatforms:  ['Google', 'Yelp', 'Angi', 'HomeAdvisor'],
    neverMention:     ['patients', 'legal', 'medical', 'attorney', 'dine', 'menu', 'inventory'],
    insightFraming: {
      seo:        'When a furnace fails in January or AC dies in July, homeowners search immediately and call the first trusted result. Not ranking locally means missing your highest-value emergency calls.',
      conversion:  'A homeowner in discomfort wants a number to call and a time you can come. Anything that adds friction — missing phone number, no service area listed — costs you the job.',
      reputation:  'HVAC is a big-ticket purchase and homeowners trust strangers in their mechanical rooms. Reviews are how they decide who to trust. Fewer than 30 reviews means competitors get the call.',
      content:     'Homeowners do not know the difference between SEER ratings and refrigerant types — but they want to know you do. Clear service descriptions and educational content build confidence before the call.',
      trust:       'NATE certification, manufacturer authorisation logos, and financing options on your homepage tell a nervous homeowner you are a legitimate business, not a one-truck fly-by-night.',
      local:       'HVAC is seasonal and local. Your Google Business Profile needs current hours, seasonal offers, and recent reviews to compete during peak demand periods.',
      technical:   'An HVAC site with broken forms or slow load times loses quote requests worth thousands of dollars — especially during summer and winter peaks.',
      mobile:      'Emergency HVAC searches happen on mobile, often while the homeowner is standing in a hot house. A click-to-call button at the top of a fast mobile page is worth thousands in additional revenue.',
      performance: 'During a heatwave or cold snap your site traffic spikes. A slow site under load means lost leads at the exact moment demand is highest.',
    },
  },

  LAW_FIRM: {
    customerType:     'individuals and businesses facing legal issues — from personal injury and family law to business disputes and estate planning',
    trustSignals:     ['bar admissions', 'case results and settlements', 'attorney profiles and credentials', 'client testimonials', 'peer recognitions'],
    keywordPatterns:  ['personal injury lawyer [city]', 'divorce attorney [city]', 'estate planning attorney [city]', 'DUI lawyer near me', 'employment attorney [city]'],
    avgTicketLow:     1500,
    avgTicketHigh:    25000,
    fears:            ['losing their case', 'being overcharged', 'not being heard', 'picking the wrong attorney', 'hidden fees'],
    ctaLanguage:      ['Free consultation', 'Speak to an attorney', 'Get legal help now', 'Schedule a case review'],
    competitors:      'other local firms and national aggregators like Martindale-Hubbell and Avvo',
    conversionMoment: 'a free consultation booking or a direct phone call to the firm',
    reviewPlatforms:  ['Google', 'Avvo', 'Martindale-Hubbell', 'Yelp'],
    neverMention:     ['customers', 'shoppers', 'car', 'vehicle', 'dine', 'menu', 'patients', 'medical'],
    insightFraming: {
      seo:        'People facing legal problems search with urgency and high intent. A firm that does not appear in local results for its practice areas loses consultations to competitors who rank above them.',
      conversion:  'A prospective client who finds your site is scared and looking for reassurance. A confusing site, missing practice area pages, or no clear way to contact you sends them to another firm.',
      reputation:  'Hiring an attorney is one of the most significant decisions a person makes. Clients read every review. Firms with fewer than 15 reviews or anything below 4.5 stars lose high-value consultations daily.',
      content:     'Clients want to understand their situation before they call. Practice area pages that explain the process, what to expect, and what outcomes are possible convert at significantly higher rates.',
      trust:       'Bar admissions, case results, attorney biographies, and peer recognitions are the proof that converts a frightened prospect into a consultation booking.',
      local:       'Legal searches are intensely local. Your Google Business Profile practice area categories, office hours, and recent reviews determine whether you appear when a potential client searches in your city.',
      technical:   'A broken contact form or a site that times out on mobile could mean a lost client with a six-figure case. Technical reliability is a trust signal in itself.',
      mobile:      'People in legal distress search on their phones. If your site does not present your number, practice areas, and a contact option clearly on mobile, they call the firm whose site does.',
      performance: "A slow firm website signals a slow firm. In a category built entirely on trust and competence, your site's performance is a direct reflection of your practice.",
    },
  },

  REAL_ESTATE: {
    customerType:     'home buyers, sellers, and investors searching for an agent or property listings',
    trustSignals:     ['sold listings and results', 'client testimonials', 'local market knowledge content', 'professional photos', 'years of experience'],
    keywordPatterns:  ['real estate agent [city]', 'homes for sale [city]', 'sell my home [city]', 'realtor near me', 'buy a house [city]'],
    avgTicketLow:     6000,
    avgTicketHigh:    18000,
    fears:            ['leaving money on the table', 'choosing the wrong agent', 'slow sale', 'hidden costs', 'losing a bid'],
    ctaLanguage:      ['Search homes', 'Get a home valuation', 'Talk to an agent', 'List your home'],
    competitors:      'other local agents, teams, and national brands like Zillow and Redfin',
    conversionMoment: 'a consultation booking, a home valuation request, or a saved search registration',
    reviewPlatforms:  ['Google', 'Zillow', 'Realtor.com', 'Yelp'],
    neverMention:     ['patients', 'legal', 'medical', 'attorney', 'dine', 'menu', 'repair', 'fix'],
    insightFraming: {
      seo:        'Buyers and sellers search for agents months before they are ready to transact. Agents who rank locally capture the relationship early — before the commission decision is made.',
      conversion:  'A buyer or seller who visits your site is evaluating you. No recent sold listings, no clear value proposition, or a generic template site means they contact the agent whose site built more confidence.',
      reputation:  "Real estate is a relationship business executed in one of the largest transactions of a person's life. Agents with fewer than 20 reviews or below 4.7 stars lose listings to better-reviewed competitors.",
      content:     'Local market content — neighbourhood guides, school ratings, recent sales data — positions you as the area expert and attracts organic search traffic from buyers researching their move.',
      trust:       'Your sold listings, client testimonials, and local statistics are your proof. An agent site without them is indistinguishable from a new agent with no track record.',
      local:       'Real estate is the most local of all businesses. Your Google Business Profile, local content, and citation consistency determine whether you appear when someone searches for an agent in a specific neighbourhood.',
      technical:   'A site where property search breaks or contact forms fail loses leads worth tens of thousands in commission. Technical reliability is not optional in real estate.',
      mobile:      'Buyers browse listings on their phones constantly. A site that is slow or hard to navigate on mobile means your listings are being viewed on Zillow instead — where a competitor gets the lead.',
      performance: 'Listing photos that are slow to load drive buyers to competitor sites. In real estate, the visual experience is the product — it must be fast.',
    },
  },

  MEDICAL: {
    customerType:     'patients searching for a provider — for primary care, specialist consultations, or urgent needs',
    trustSignals:     ['board certifications', 'hospital affiliations', 'insurance accepted', 'patient reviews', 'years of experience'],
    keywordPatterns:  ['doctor near me', 'primary care physician [city]', '[specialist] near me', 'urgent care [city]', 'accepting new patients [city]'],
    avgTicketLow:     150,
    avgTicketHigh:    800,
    fears:            ['long wait times', 'insurance not accepted', 'not being heard', 'impersonal care', 'difficult to get appointment'],
    ctaLanguage:      ['Book an appointment', 'Request a consultation', 'Check insurance', 'New patients welcome'],
    competitors:      'other local practices, hospital systems, and urgent care chains',
    conversionMoment: 'a new patient appointment request or a phone call to the front desk',
    reviewPlatforms:  ['Google', 'Healthgrades', 'Zocdoc', 'Vitals'],
    neverMention:     ['customers', 'buyers', 'shoppers', 'car', 'vehicle', 'legal', 'attorney', 'dine'],
    insightFraming: {
      seo:        'Patients searching for a new provider make high-stakes decisions. A practice that does not appear in local search results loses new patients to competitors who do — permanently, not just for one visit.',
      conversion:  'A patient who found your site is already considering you. Missing insurance information, no online booking, or a confusing navigation sends them to another provider.',
      reputation:  'Patients read reviews before booking medical appointments more than almost any other service. A practice with fewer than 25 reviews or below 4.3 stars consistently loses new patient inquiries.',
      content:     'Patients want to understand what to expect, what conditions you treat, and whether you accept their insurance before they pick up the phone. Every unanswered question is a booking that goes elsewhere.',
      trust:       'Your credentials, hospital affiliations, and board certifications displayed clearly tell a concerned patient this is a practice they can trust with their health.',
      local:       'Medical searches are hyperlocal. Your Google Business Profile with accurate hours, accepted insurance, and recent patient reviews determines whether you appear when someone needs care.',
      technical:   'A practice site with broken appointment booking or slow load times loses patients to competitors who make it easier. In healthcare, friction is not acceptable.',
      mobile:      'Patients search for providers on mobile, often when they are already unwell. A site that is hard to navigate on a phone means they call the next result on the list.',
      performance: 'A slow medical website creates anxiety in patients who are already worried. Speed is a trust signal in a category where trust is everything.',
    },
  },

  VETERINARY: {
    customerType:     'pet owners searching for a vet — for routine care, emergencies, dental cleanings, or specialist referrals',
    trustSignals:     ['AAHA accreditation', 'doctor profiles and credentials', 'patient photos', 'Google reviews', 'species and services list'],
    keywordPatterns:  ['vet near me', 'veterinarian [city]', 'emergency vet [city]', 'cat vet [city]', 'dog dental cleaning [city]'],
    avgTicketLow:     120,
    avgTicketHigh:    2800,
    fears:            ['not getting an appointment quickly', 'high costs', 'their pet being scared or mistreated', 'misdiagnosis'],
    ctaLanguage:      ['Book an appointment', 'Request a wellness exam', 'Emergency care available', 'New patients welcome'],
    competitors:      'other local vet practices and corporate chains like Banfield and VCA',
    conversionMoment: 'an appointment booking or a phone call to the clinic',
    reviewPlatforms:  ['Google', 'Yelp', 'Vetstreet'],
    neverMention:     ['customers', 'car', 'vehicle', 'legal', 'attorney', 'dine', 'menu', 'clients buying'],
    insightFraming: {
      seo:        'Pet owners in distress search immediately and call the first trusted result. A veterinary practice that does not rank locally loses both emergency and routine care appointments to competitors who do.',
      conversion:  'A pet owner who finds your site is emotionally invested and looking for reassurance. A confusing site or missing appointment booking option sends them — and their pet — to a competitor.',
      reputation:  'Pet owners treat their animals like family. They read reviews obsessively before choosing a vet. Fewer than 30 reviews or a rating below 4.4 means most pet owners choose someone else.',
      content:     'Listing your species, services, and what to expect at a first visit removes the anxiety that makes pet owners hesitate to book. Educational content builds trust before the appointment.',
      trust:       'AAHA accreditation, doctor credentials, and photos of your team and facility tell a worried pet owner this is a place their animal will be safe.',
      local:       'Veterinary searches are highly local. Your Google Business Profile hours, services, and recent reviews are often the deciding factor between your clinic and a competitor down the road.',
      technical:   'A vet site with a broken booking system or slow load times loses appointments — especially during evenings and weekends when pet emergencies peak.',
      mobile:      'Pet emergencies happen at all hours and are searched on mobile. Your phone number and emergency hours need to be the first thing a panicking pet owner sees.',
      performance: 'A slow veterinary website creates anxiety for pet owners who are already worried. Fast load times are a signal that your practice is professional and reliable.',
    },
  },

  SALON_SPA: {
    customerType:     'individuals searching for hair, beauty, nail, or wellness services',
    trustSignals:     ['portfolio photos', 'stylist profiles', 'Google reviews', 'before and after photos', 'product brands used'],
    keywordPatterns:  ['hair salon near me', 'nail salon [city]', 'massage [city]', 'balayage [city]', 'lash extensions [city]'],
    avgTicketLow:     65,
    avgTicketHigh:    320,
    fears:            ['bad haircut', 'not matching the inspiration photo', 'overbooking', 'unclean environment', 'price surprise'],
    ctaLanguage:      ['Book an appointment', 'View services and pricing', 'Meet our stylists', 'Book online'],
    competitors:      'other local salons and booking platforms like StyleSeat and Vagaro',
    conversionMoment: 'an online booking or a phone call to schedule an appointment',
    reviewPlatforms:  ['Google', 'Yelp', 'StyleSeat', 'Instagram'],
    neverMention:     ['patients', 'legal', 'attorney', 'car', 'vehicle', 'repair', 'emergency'],
    insightFraming: {
      seo:        'Most salon clients search by service and location — "balayage near me" or "nail salon [city]." A salon that does not appear for its core services loses bookings to competitors who rank for those terms.',
      conversion:  'A potential client who finds your salon online wants to see your work, your pricing, and a way to book right now. Missing any of these sends them to a competitor with a better-converting site.',
      reputation:  'Salon clients are making a personal, appearance-related decision. They read reviews and look at photos carefully. Fewer than 40 reviews or a rating below 4.4 loses you bookings daily.',
      content:     'A services menu with clear descriptions, pricing, and time estimates removes the hesitation that stops potential clients from booking. Portfolio photos do the rest.',
      trust:       'Stylist profiles, product brands, training certifications, and a clean photo gallery tell a potential client this is a professional salon worth their time and money.',
      local:       'Salon clients rarely travel far. Your Google Business Profile with accurate hours, services, and photos is what determines whether you appear when someone searches nearby.',
      technical:   'A booking form that breaks or a site that loads slowly loses appointments — especially from mobile users who want to book in the moment.',
      mobile:      'Most salon bookings are initiated on mobile. An easy-to-navigate site with visible services, pricing, and a prominent "Book now" button is worth thousands in additional monthly revenue.',
      performance: 'Clients browsing salon options will not wait for slow-loading portfolio photos. Speed is part of the first impression your brand makes.',
    },
  },

  GYM_FITNESS: {
    customerType:     'individuals looking to join a gym, try classes, or work with a personal trainer',
    trustSignals:     ['member testimonials', 'trainer credentials', 'class schedule visibility', 'before and after results', 'free trial offer'],
    keywordPatterns:  ['gym near me', 'personal trainer [city]', 'yoga classes [city]', 'CrossFit [city]', 'fitness classes near me'],
    avgTicketLow:     45,
    avgTicketHigh:    280,
    fears:            ["wasting money on a membership they won't use", 'intimidating environment', 'locked into a contract', 'not seeing results'],
    ctaLanguage:      ['Start your free trial', 'Join today', 'View class schedule', 'Book a tour'],
    competitors:      'other local gyms, boutique studios, and national chains like Planet Fitness and Orangetheory',
    conversionMoment: 'a free trial signup, a tour booking, or a direct membership purchase',
    reviewPlatforms:  ['Google', 'Yelp', 'ClassPass'],
    neverMention:     ['patients', 'legal', 'attorney', 'car', 'vehicle', 'repair', 'emergency'],
    insightFraming: {
      seo:        'People searching for a gym are motivated and ready to act. A fitness business that does not appear for "[type] gym near me" loses members who sign up with the first gym that shows up.',
      conversion:  "A prospect who finds your gym online is evaluating whether it is the right fit. No class schedule, no pricing, and no free trial offer means they join a competitor who answered those questions.",
      reputation:  'Joining a gym is a commitment. Prospects read reviews to understand the community and culture. Fewer than 30 reviews or below 4.3 stars loses you members to better-reviewed gyms.',
      content:     'A clear class schedule, trainer profiles, and member results content tells a nervous prospect exactly what they are joining and what they can achieve.',
      trust:       'Trainer certifications, member testimonials, and a welcoming photo gallery of your facility remove the intimidation that stops many people from walking through the door.',
      local:       'Gym searches are local and often impulsive. Your Google Business Profile with current hours, class types, and recent reviews is what captures people who are ready to start today.',
      technical:   'A gym site with a broken class booking system or a schedule that will not load on mobile loses signups at the exact moment a prospect is motivated.',
      mobile:      'Most gym searches happen on mobile — often after a run or on a lunch break when motivation is high. A fast, clear site with a prominent free trial CTA converts that motivation into a membership.',
      performance: 'A slow gym website kills momentum. Prospects who are fired up about getting fit will not wait for a slow page to load — they will find a faster competitor.',
    },
  },

  ACCOUNTING: {
    customerType:     'small business owners, self-employed individuals, and families needing tax, bookkeeping, or financial advisory services',
    trustSignals:     ['CPA designation', 'years of experience', 'industries served', 'client testimonials', 'IRS representation credentials'],
    keywordPatterns:  ['accountant near me', 'CPA [city]', 'tax preparation [city]', 'bookkeeping services [city]', 'small business accountant [city]'],
    avgTicketLow:     400,
    avgTicketHigh:    8000,
    fears:            ['IRS audit', 'overpaying taxes', 'missing a filing deadline', 'choosing someone unqualified', 'being charged by the hour with no clarity'],
    ctaLanguage:      ['Schedule a consultation', 'Get a quote', 'Free initial consultation', 'Talk to a CPA'],
    competitors:      'other local CPA firms and national brands like H&R Block and TurboTax',
    conversionMoment: 'a consultation booking or a phone call to discuss services and pricing',
    reviewPlatforms:  ['Google', 'Yelp', 'Thumbtack'],
    neverMention:     ['patients', 'car', 'vehicle', 'dine', 'menu', 'emergency repair'],
    insightFraming: {
      seo:        'Business owners search for accountants when they have a deadline, a problem, or a life event. A firm that does not appear locally misses clients at the exact moment they are ready to hire.',
      conversion:  'A prospect who finds your firm is evaluating whether you understand their situation. Missing service descriptions, no pricing guidance, and no clear next step sends them to a competitor.',
      reputation:  'Accounting is a trust business. Clients are sharing their most sensitive financial information. Fewer than 20 reviews or below 4.5 stars means most prospects choose a more reviewed firm.',
      content:     'Explaining your services, your process, and who you serve best removes the hesitation that stops business owners from reaching out. Industry-specific pages convert at far higher rates.',
      trust:       'Your CPA credentials, professional affiliations, and years of experience are the proof that converts a nervous business owner into a long-term client.',
      local:       'Most small businesses want a local accountant they can meet in person. Your Google Business Profile with clear services, office hours, and recent reviews is your most important acquisition channel.',
      technical:   'An accounting firm with a broken contact form or a site that fails on mobile loses consultation requests — often from business owners ready to hire immediately.',
      mobile:      'Business owners searching for accounting help do so on their phones, often during a stressful moment. A clear, fast mobile site with a prominent "book a consultation" option is worth significant monthly revenue.',
      performance: "A slow website signals a disorganised firm. In a category where clients are trusting you with their finances, your site's professionalism and speed are a direct reflection of your work.",
    },
  },

  INSURANCE: {
    customerType:     'individuals and businesses shopping for insurance coverage — home, auto, life, health, or commercial',
    trustSignals:     ['carrier logos', 'years in business', 'Google reviews', 'independent agent status', 'licensed and bonded badges'],
    keywordPatterns:  ['insurance agent near me', 'home insurance [city]', 'auto insurance quote [city]', 'life insurance [city]', 'business insurance [city]'],
    avgTicketLow:     800,
    avgTicketHigh:    4500,
    fears:            ['being underinsured', 'paying too much', 'claims being denied', 'poor service when they need it most', 'pushy agents'],
    ctaLanguage:      ['Get a free quote', 'Compare your options', 'Talk to an agent', 'Review your coverage'],
    competitors:      'other independent agents and direct carriers like State Farm, Allstate, and Geico',
    conversionMoment: 'a quote request or a phone call to discuss coverage options',
    reviewPlatforms:  ['Google', 'Yelp', 'Facebook'],
    neverMention:     ['patients', 'medical', 'dine', 'menu', 'car repair', 'emergency plumbing'],
    insightFraming: {
      seo:        'Insurance shoppers compare multiple providers before committing. An agent who does not appear in local search misses prospects who are actively comparing options and ready to buy.',
      conversion:  'A prospect on your site is in shopping mode. No clear coverage types, no quote request form, and no visible carrier options sends them to a competitor who makes it easier to get started.',
      reputation:  'Insurance is a promise to pay when things go wrong. Clients read reviews to understand whether an agent delivers on that promise. Fewer than 25 reviews or below 4.4 stars loses you business daily.',
      content:     'Educational content that explains coverage types, what affects premiums, and how to compare policies positions your agency as a trusted advisor — not just another quote machine.',
      trust:       "Carrier logos, your license number, years of experience, and client testimonials tell a cautious prospect this is an agent they can rely on when they need to make a claim.",
      local:       'Many insurance shoppers prefer a local agent they can call directly. Your Google Business Profile with clear service lines and recent reviews is what puts you in front of those prospects.',
      technical:   'A broken quote request form loses you leads that went to a competitor with a working one. In insurance, every lost lead is a policy you will never write.',
      mobile:      'Insurance shoppers research on mobile. A fast site with a clear quote request form and visible phone number is the difference between a new client and a missed opportunity.',
      performance: 'A slow insurance website signals an outdated agency. Prospects comparing options online will spend their time on sites that load quickly and make getting a quote easy.',
    },
  },

  ROOFING: {
    customerType:     'homeowners needing roof repair, replacement, or inspection — often after a storm or when selling their home',
    trustSignals:     ['manufacturer certifications', 'Google reviews', 'insurance claim experience', 'warranty information', 'before and after photos', 'years in business'],
    keywordPatterns:  ['roofing contractor near me', 'roof repair [city]', 'roof replacement [city]', 'storm damage roof [city]', 'free roof inspection [city]'],
    avgTicketLow:     1200,
    avgTicketHigh:    28000,
    fears:            ['being scammed by storm chasers', 'not getting the insurance claim covered', 'poor workmanship', 'roof leaking again', 'unclear pricing'],
    ctaLanguage:      ['Get a free inspection', 'Request a quote', 'Storm damage help', 'Schedule your roof assessment'],
    competitors:      'other local roofing contractors and door-to-door storm chasers',
    conversionMoment: 'a free inspection request or a phone call to discuss the scope of work',
    reviewPlatforms:  ['Google', 'Yelp', 'Angi', 'HomeAdvisor', 'GAF Master Elite directory'],
    neverMention:     ['patients', 'legal', 'medical', 'attorney', 'dine', 'car', 'fitness'],
    insightFraming: {
      seo:        'Homeowners search for roofers immediately after a storm or when they spot a leak. A contractor who does not rank locally misses high-value jobs that go to visible competitors.',
      conversion:  'A homeowner with a roof problem is anxious and ready to act. Missing your credentials, no photo gallery of past work, or no clear way to request an inspection sends them to a competitor.',
      reputation:  'Roofing is the highest-ticket home improvement purchase most homeowners make. They research extensively. Fewer than 30 reviews or below 4.4 stars means most choose a more trusted competitor.',
      content:     'Explaining your process, your warranties, and your insurance claim experience removes the fear of being taken advantage of — the #1 objection in the roofing industry.',
      trust:       'Manufacturer certifications like GAF Master Elite, before and after photos, and insurance claim expertise displayed prominently tell a homeowner this contractor can be trusted with their biggest asset.',
      local:       'Roofing is intensely local and storm-driven. Your Google Business Profile with current reviews and clear service areas determines whether you appear when homeowners search after weather events.',
      technical:   'A roofing company with a broken quote form or a site that crashes under traffic after a storm loses their highest-demand moment of the year.',
      mobile:      'Homeowners standing in their driveway looking at storm damage search on their phones. A fast site with an immediate "get a free inspection" option captures those leads before competitors do.',
      performance: 'A slow roofing site loses leads during the post-storm window when demand is highest. Every second of load time costs you jobs worth thousands of dollars.',
    },
  },

  LANDSCAPING: {
    customerType:     'homeowners and property managers wanting lawn care, garden design, or landscape maintenance',
    trustSignals:     ['portfolio photos', 'Google reviews', 'licensed and insured badges', 'before and after photos', 'seasonal service packages'],
    keywordPatterns:  ['landscaping near me', 'lawn care [city]', 'landscape design [city]', 'tree service [city]', 'lawn mowing [city]'],
    avgTicketLow:     180,
    avgTicketHigh:    12000,
    fears:            ['unreliable service', 'damage to property', 'hidden costs', 'inconsistent quality', 'no-shows'],
    ctaLanguage:      ['Get a free quote', 'Schedule your service', 'Book a design consultation', 'Request an estimate'],
    competitors:      'other local landscapers and national services like TruGreen and LawnStarter',
    conversionMoment: 'a quote request or a phone call to schedule an estimate',
    reviewPlatforms:  ['Google', 'Yelp', 'Angi', 'Nextdoor'],
    neverMention:     ['patients', 'legal', 'medical', 'attorney', 'dine', 'car', 'vehicle'],
    insightFraming: {
      seo:        'Homeowners search for landscapers seasonally — spring cleanup, summer maintenance, fall prep. A company that does not rank locally misses recurring revenue opportunities that go to visible competitors.',
      conversion:  'A homeowner who finds your landscaping site wants to see your work and get a quote. No portfolio, no service list, and no clear way to request an estimate sends them to a competitor.',
      reputation:  'Landscaping is a recurring service relationship. Homeowners read reviews to find someone reliable who will show up consistently. Fewer than 25 reviews or below 4.3 stars loses you long-term accounts.',
      content:     'Showing your portfolio by service type — lawn care, garden design, hardscaping — lets homeowners self-select and arrive at the quote stage already sold on your work.',
      trust:       'Licensed and insured badges, years in business, and a portfolio of local properties tell a homeowner their yard will be treated professionally and their property is protected.',
      local:       'Landscaping is hyperlocal. Your Google Business Profile with seasonal offers, service area, and recent reviews captures homeowners searching for reliable local companies.',
      technical:   'A landscaping site with a broken quote form or a portfolio that will not load on mobile loses enquiries — especially in spring when demand peaks.',
      mobile:      'Homeowners research landscapers on their phones while standing in their garden. A fast mobile site with a prominent quote request button converts that moment into a recurring account.',
      performance: 'A slow landscaping website loses seasonal leads during peak demand. Spring and fall search surges require a site that loads instantly across all devices.',
    },
  },

  OTHER: {
    customerType:     'local customers searching for your products or services in your area',
    trustSignals:     ['Google reviews', 'years in business', 'professional website', 'clear contact information', 'social proof'],
    keywordPatterns:  ['[your service] near me', '[your service] [city]', 'best [your service] [city]'],
    avgTicketLow:     150,
    avgTicketHigh:    500,
    fears:            ['wasting money', 'poor quality', 'unreliable service', 'unclear pricing'],
    ctaLanguage:      ['Get in touch', 'Request a quote', 'Book a consultation', 'Call us today'],
    competitors:      'other local businesses offering similar services',
    conversionMoment: 'a phone call, form submission, or direct booking',
    reviewPlatforms:  ['Google', 'Yelp'],
    neverMention:     [],
    insightFraming: {
      seo:        'Local customers search online before they buy. A business that does not appear in local search results misses customers who are actively ready to spend.',
      conversion:  'A visitor on your site is already interested. Friction, missing information, or no clear contact option sends them to a competitor who makes it easier to take the next step.',
      reputation:  'Reviews are the most trusted form of social proof for local businesses. Fewer than 20 reviews or below 4.3 stars consistently costs you customers who choose more reviewed competitors.',
      content:     'Clear service descriptions, pricing guidance, and answers to common questions remove the hesitation that stops potential customers from reaching out.',
      trust:       'Displaying your credentials, experience, and customer success stories builds the confidence local customers need before committing to a purchase.',
      local:       'Your Google Business Profile is often the first impression local customers have of your business. Keeping it complete, accurate, and reviewed is your highest-leverage marketing activity.',
      technical:   'A website with technical issues — broken forms, slow load times, or errors — signals an unreliable business to potential customers who have other options.',
      mobile:      'Most local searches happen on mobile. A site that is fast and easy to use on a phone is no longer optional — it is the baseline expectation.',
      performance: 'Every second of load time costs you potential customers who move on to a competitor. Site speed is a direct driver of local business enquiries.',
    },
  },

}

export function getVerticalContext(industry: string): VerticalContext {
  return VERTICAL_CONTEXT[industry] ?? VERTICAL_CONTEXT['OTHER']
}

export function buildVerticalSystemPrompt(industry: string): string {
  const ctx = getVerticalContext(industry)
  return `
VERTICAL CONTEXT — READ THIS FIRST AND APPLY TO EVERY SENTENCE YOU WRITE:

This business is in the ${industry.replace(/_/g, ' ')} industry.

Customer type: ${ctx.customerType}
What a conversion looks like: ${ctx.conversionMoment}
Who they compete with: ${ctx.competitors}
What their customers fear: ${ctx.fears.join(', ')}
Trust signals that matter in this vertical: ${ctx.trustSignals.join(', ')}
CTAs that convert in this vertical: ${ctx.ctaLanguage.join(', ')}
Where reviews matter: ${ctx.reviewPlatforms.join(', ')}

HARD RULE — NEVER use these words or reference these industries:
${ctx.neverMention.length > 0 ? ctx.neverMention.join(', ') : 'N/A'}

Every insight, recommendation, and narrative you write MUST:
1. Reference ${ctx.customerType} — not generic "customers" or wrong-industry terms
2. Use the trust signals, CTAs, and language appropriate for this vertical
3. Frame revenue impact using typical ticket sizes for this industry ($${ctx.avgTicketLow}–$${ctx.avgTicketHigh})
4. Sound like it was written by someone who deeply understands this specific industry

If you find yourself writing language that could apply to any industry, STOP and rewrite it using the vertical context above.
`.trim()
}
