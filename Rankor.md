# Rankor - Comprehensive Product & Functionalities Documentation

## 📋 Executive Summary

Rankor is a **hybrid platform (web + mobile app)** designed to professionalize and structure the amateur fighting ecosystem. It connects event organizers and athletes through a centralized system that manages competitions, tracks athlete progression, and creates lasting records of fights and achievements.

**Core Promise**: "Dar sentido ao confronto" (Give meaning to the fight) - transforming amateur fighting from chaotic, unrecorded events into a professional, transparent, and rewarding competitive ecosystem.

---

## 🎯 Problem Statement

### Current State of Amateur Fighting
- **Organizational Chaos**: Events managed through WhatsApp, spreadsheets, and paper records
- **No Historical Record**: Fights happen and are forgotten; athlete progression is unmeasured
- **Lack of Athlete Visibility**: Talented competitors have no platform to build their legacy
- **Weak Event Branding**: Without professionalism, events struggle to attract sponsorships and quality athletes
- **No Standardization**: Each event has different rules, categories, and scoring systems
- **Lost Opportunity**: Athletes and organizers have no way to connect or discover each other

### Impact
- Talented amateur athletes remain invisible
- Event organizers can't scale or professionalize their operations
- The amateur fighting community lacks infrastructure and legitimacy
- Rivalries and competitive narratives never develop

---

## ✅ Rankor Solution

Rankor is the **infrastructure that was missing** from amateur fighting. It provides:

1. **Centralized Event Management**: One platform for all operational needs
2. **Standardized Ranking System**: Fair, transparent, real-time athlete rankings
3. **Athlete Visibility**: Professional profiles that build lasting legacies
4. **Professional Event Pages**: Instant professionalization of any event
5. **Data-Driven Insights**: Metrics and analytics for organizers
6. **Viral Growth Engine**: Athletes become ambassadors for events through social sharing

---

## 🏗️ Core Architecture

### Modality System (Foundation)

Rankor supports **multiple fighting modalities**, each with unique rules, scoring, and judging systems.

#### Supported Modalities

**1. Boxing**
- **Weight Classes**: 17 standard divisions (Peso Mínimo to Peso Pesado)
- **Win Methods**: KO, TKO, Unanimous Decision, Split Decision, Majority Decision, Disqualification, Retirement, Technical Decision
- **Judging System**: Round Dominance (10-Point Must)
- **Scoring Actions**: Head shots (2pts), body shots (1pt), significant head shots (4pts), knockdowns (10pts)
- **Rounds**: Typically 3-12 rounds of 3 minutes each

**2. MMA (Mixed Martial Arts)**
- **Weight Classes**: 8 divisions following Unified Rules (Peso Mosca to Peso Pesado)
- **Win Methods**: KO, TKO, Submission, Technical Submission, Unanimous Decision, Split Decision, Majority Decision, Disqualification, Retirement, No Contest
- **Judging System**: Round Dominance (10-Point Must) - evaluated on damage, control, aggression
- **Scoring Actions**: 
  - Striking: Head shots (1-3pts), body kicks (3-4pts), head kicks (5pts), knockdowns (10pts)
  - Grappling: Takedowns (5pts), guard pass (3pts), mount/back control (5pts), sweep (3pts), submission attempts (4pts)
  - Defense: Takedown defense (2pts), kick checks (2pts)
- **Rounds**: Typically 3-5 rounds of 5 minutes each

**3. Jiu-Jitsu (Brazilian Jiu-Jitsu)**
- **Weight Classes**: 9 divisions (Peso Galo to Peso Pesadíssimo) - IBJJF standard with Gi
- **Win Methods**: Submission, Disqualification, Decision by Points, Decision by Advantages, Referee Decision, Walkover
- **Judging System**: Cumulative Points (with Advantages/Penalties as tiebreakers)
- **Scoring Actions**:
  - Takedown (2pts)
  - Sweep (2pts)
  - Knee on Belly (2pts)
  - Guard Pass (3pts)
  - Mount Position (4pts)
  - Back Mount with Hooks (4pts)
  - Advantages (1 point equivalent)
  - Penalties (-1 point equivalent)
- **Match Duration**: Varies by belt level (5-10 minutes typical)

**4. Muay Thai**
- **Weight Classes**: 18 divisions (Mini-Mosca to Super-Pesado)
- **Win Methods**: KO, TKO, Unanimous Decision, Split Decision, Majority Decision, Disqualification, Retirement, Technical Decision
- **Judging System**: Round Dominance (10-Point Must)
- **Scoring Actions**:
  - Punches: Head shot (1pt), body shot (1pt), significant head shot (3pts)
  - Kicks: Leg kick (2pts), body kick (4pts), head kick (6pts)
  - Clinch: Knee strikes (5pts), sweep/dump (8pts)
  - Defense: Kick check (2pts)
  - Knockdown (10pts)
- **Rounds**: Typically 3-5 rounds of 3 minutes each

**5. Kickboxing**
- **Weight Classes**: 6 simplified divisions (Peso Pena to Peso Pesado)
- **Win Methods**: KO, TKO, Unanimous Decision, Split Decision, Majority Decision, Disqualification, Retirement, Technical Decision
- **Judging System**: Round Dominance (10-Point Must)
- **Scoring Actions**:
  - Punches: Head shot (1pt), body shot (1pt), significant head shot (4pts)
  - Kicks: Leg kick (2pts), body kick (4pts), head kick (8pts)
  - Defense: Kick check (2pts)
  - Knockdown (10pts)
- **Rounds**: Typically 3-5 rounds of 3 minutes each

**Additional Supported Modalities**:
- Judo
- Karate
- Taekwondo
- Wrestling (Greco-Roman & Freestyle)
- Sambo
- (Extensible for future modalities)

---

### Modality Configuration (JSON Structure)

Each modality is defined by a `modalityConfig` JSON object that contains:

```json
{
  "id": "unique_id",
  "code": "modality_code",
  "name": "Modality Name",
  "modalityConfig": {
    
    "defaultWeightClasses": [
      {
        "title": "Weight Class Name",
        "minWeight": 0,
        "maxWeight": 66.7
      }
    ],
    
    "winMethods": [
      "ko",
      "tko",
      "submission",
      "unanimous_decision",
      "split_decision",
      "majority_decision",
      "disqualification",
      "retirement",
      "technical_decision",
      "no_contest"
    ],
    
    "scoringMethods": {
      "action_code": points_value,
      "head_shot": 1,
      "sig_head_shot": 3,
      "knockdown": 10
    },
    
    "roundConfiguration": {
      "numberOfRounds": 3,
      "roundDurationMinutes": 3,
      "restDurationMinutes": 1
    },
    
    "rankingModifiers": {
      "baseWinPoints": 100,
      "pointsByWinMethod": [
        { "code": "KO", "multiplier": 1.5 },
        { "code": "SUBMISSION", "multiplier": 1.5 },
        { "code": "UD", "multiplier": 1.2 }
      ]
    },
    
    "requiredEquipment": [
      { "item": "Gloves", "spec": "10 oz" },
      { "item": "Mouthguard", "spec": "Required" }
    ]
  }
}

🎮 Judging Systems
Rankor supports multiple judging methodologies to accurately reflect how different fighting sports score matches:

1. Round Dominance (10-Point Must System)
Used By: Boxing, MMA, Kickboxing, Muay Thai

How It Works:

Each round is scored independently
Winner of the round gets 10 points, loser gets 9 or less (8 for dominant round, 7 for very dominant)
Knockdowns can result in 10-7 or 10-8 scores
Final score is the sum of all round scores
Three judges score independently; majority rules
Scoring Criteria:

Effective striking and grappling
Aggression and octagon/ring control
Defense and evasion
Overall dominance
UI Implementation:

Judges input round-by-round scores (10-9, 10-8, etc.)
System calculates total and determines winner
Metrics from scoringMethods serve as reference data for judges to evaluate dominance
2. Cumulative Points
Used By: Jiu-Jitsu, Wrestling, Taekwondo (WT)

How It Works:

Each technique or action has a fixed point value
Points accumulate throughout the match
Winner is determined by total points at match end
In case of tie, advantages (near-successful techniques) are tiebreaker
Penalties can reduce points or advantages
Scoring Criteria:

Specific techniques have specific values (e.g., takedown = 2pts, guard pass = 3pts)
Advantages awarded for near-successful techniques
Penalties for rule violations
UI Implementation:

Real-time point counter for each athlete
Separate advantage and penalty counters
System calculates winner based on points > advantages > penalties hierarchy
3. Quality-Based (Ippon System)
Used By: Judo, traditional Karate

How It Works:

One perfect technique can end the match (Ippon = full point)
Near-perfect techniques are worth less (Waza-ari = half point)
Two Waza-ari = one Ippon
Match ends immediately when Ippon is awarded
If no Ippon, winner determined by Waza-ari count
UI Implementation:

Special logic to detect and award instant-win conditions
Counter for Waza-ari scores
Match termination on Ippon
4. Point-Stop (Point Fighting)
Used By: Karate Point Fighting, Light-Contact Kickboxing

How It Works:

Match pauses each time a clean point is scored
Judges confirm the point
Match restarts from center
Winner is first to reach target points or most points at time end
UI Implementation:

Match state management (active vs. paused)
Point confirmation workflow
Restart protocol
👥 User Personas & Features
For Event Organizers
Primary Features
1. Event Management Dashboard

Create new events with name, date, location, description
Set modality, weight classes, and rules for each event
Manage event status (Draft → Published → In Progress → Completed)
Edit event details at any time (with restrictions once fights begin)
View event overview with key metrics
2. Fight Card Management

Multi-Step Fight Creation Flow:
Step 1: Select modality and weight class
Step 2: Drag-and-drop athlete selection with real-time "Tale of the Tape" comparison
Step 3: Configure fight-specific rules (rounds, time, special rules)
Step 4: Review and confirm
Drag-and-drop interface to organize fight order
Duplicate fights with same rules
Edit or delete fights before event starts
Generate fight cards with professional formatting
3. Athlete Management

Register athletes with personal info, photo, academy, contact
Bulk import athletes via CSV
Track athlete status (registered, weighed-in, confirmed, competed)
Manage athlete documents/waivers
View athlete cartel and historical records
4. Real-Time Results Entry

Quick result entry interface during event
Select winner, win method, and round/time
Add notes or incident reports
Automatic ranking updates
Generate result notifications
5. Public Event Page

Auto-generated professional event page with:
Event banner and description
Complete fight card with athlete details
Live results as fights conclude
Athlete profiles with links
Customizable branding (Premium)
QR code for easy sharing
Social media preview optimization
6. Dashboard & Analytics

Key metrics: registered athletes, scheduled fights, completed fights, engagement rate
Athlete breakdown by category, academy, region
Fight statistics (win methods distribution, average round duration)
Attendance/registration trends
Exportable reports (Premium)
Secondary Features (Premium)
7. Monetization Tools

Integrated ticket sales with commission structure
Sponsorship management
Revenue tracking and payouts
8. Custom Branding

White-label event pages with custom domain
Custom logo and color scheme
Branded athlete profiles
9. Intelligent Matchmaking

AI-powered fight suggestions based on:
Skill level (cartel)
Weight class compatibility
Regional proximity
Rivalry potential
Automatic bracket generation for tournaments
10. Team Management

Multiple user accounts per organization
Role-based permissions (Admin, Editor, Viewer)
Audit logs of all changes
11. API Access

RESTful API for custom integrations
Webhook support for real-time updates
Data export capabilities
For Athletes
Primary Features
1. Athlete Profile

Personal profile page with:
Photo and bio
Complete fight history (cartel: Wins-Draws-Losses)
Current ranking position
Academy affiliation
Social media links
Public, shareable profile URL
Profile QR code
2. Fight History & Cartel

Complete record of all fights with:
Opponent name and academy
Event name and date
Modality and weight class
Result (win/loss/draw) and method
Round/time of finish
Ranking points gained/lost
Filter and search fights
Export cartel as PDF
3. Ranking System

Real-time ranking position by:
Modality
Weight class
Academy
Region/State
Ranking history and progression chart
Comparison with other athletes
Ranking breakdown (points, advantages, recent performance)
4. Event Discovery

Browse upcoming events by:
Location
Modality
Weight class
Date
Event details and registration links
Calendar view of events
Notifications for new events in preferences
5. Social Sharing

One-click share fight results to:
Instagram (with story template)
Twitter/X
WhatsApp
Facebook
Pre-formatted captions with ranking info
Event attribution in all shares
Secondary Features
6. Notifications

Real-time alerts for:
New ranking position
Upcoming fights
New challenges/matchups
Event results published
7. Performance Analytics

Personal statistics:
Win rate by modality
Favorite win method
Performance trends
Strength metrics (striking accuracy, takedown defense, etc.)
8. Athlete Community

Follow other athletes
View rival matchups
Comment on fights (moderated)
Create and join athlete groups
🎲 Ranking System
Core Ranking Mechanics
1. Point Allocation

Base points for a win: 100 points (configurable per modality)
Multipliers based on win method:
KO/Submission: 1.5x (150 points)
Decision (Unanimous): 1.2x (120 points)
Decision (Split/Majority): 1.0x (100 points)
Opponent strength factor: Points adjusted based on opponent's current ranking
Beating a top-ranked opponent = more points
Losing to lower-ranked opponent = more point loss
2. Ranking Tiers Rankings are segmented by:

Modality: Separate rankings for each fighting style
Weight Class: Separate rankings within each modality
Academy: Rankings within an academy for internal competition
Region/State: Regional rankings for geographic comparison
Overall: Combined ranking across all categories
3. Ranking Updates

Real-time: Rankings update immediately after fight results are recorded
Historical: Full ranking history maintained with timestamps
Decay: (Optional) Older wins count slightly less to encourage recent activity
Inactivity: Athletes can be marked as inactive if no fights in X months
4. Ranking Display

Position with trend indicator (↑ up, ↓ down, → stable)
Points total
Recent performance (last 5 fights)
Win rate percentage
Next challenger
Comparison with adjacent ranked athletes
📊 Data Models
Core Entities
Modality
- id: UUID - code: String (unique, lowercase: "boxing", "mma", "jiujitsu") - name: String ("Boxing", "MMA", "Jiu-Jitsu") - modalityConfig: JSON (as described above) - createdAt: Timestamp - updatedAt: Timestamp - isActive: Boolean
Event
- id: UUID - organizerId: UUID (foreign key to Organization) - name: String - description: Text - date: DateTime - location: String - city: String - state: String - status: Enum (DRAFT, PUBLISHED, IN_PROGRESS, COMPLETED, CANCELLED) - modalities: Array<Modality> - weightClasses: Array<WeightClass> - customRules: JSON - publicPageUrl: String (generated slug) - qrCode: String (generated) - createdAt: Timestamp - updatedAt: Timestamp - startedAt: DateTime (nullable) - endedAt: DateTime (nullable)
Fight
- id: UUID - eventId: UUID (foreign key to Event) - fighterAId: UUID (foreign key to Athlete) - fighterBId: UUID (foreign key to Athlete) - modality: String (reference to Modality) - weightClass: String - scheduledRound: Integer - scheduledTime: Time - actualRound: Integer (nullable, set after fight) - actualTime: Time (nullable, set after fight) - result: Enum (PENDING, COMPLETED, CANCELLED) - winner: UUID (nullable, fighterAId or fighterBId) - winMethod: String (from modality.winMethods) - rules: JSON (inherited from event + fight-specific overrides) - judgeScores: Array<JudgeScore> (if applicable) - athleteAPoints: Integer (if cumulative scoring) - athleteBPoints: Integer (if cumulative scoring) - notes: Text - createdAt: Timestamp - updatedAt: Timestamp
Athlete
- id: UUID - firstName: String - lastName: String - email: String - phone: String - dateOfBirth: Date - photo: URL - bio: Text - academyId: UUID (foreign key to Academy, nullable) - primaryModality: String - height: Float (cm) - reach: Float (cm) - createdAt: Timestamp - updatedAt: Timestamp - profilePublic: Boolean - socialLinks: JSON { instagram, twitter, facebook }
Ranking
- id: UUID - athleteId: UUID (foreign key to Athlete) - modality: String - weightClass: String - position: Integer (1, 2, 3, ...) - points: Integer - wins: Integer - losses: Integer - draws: Integer - winRate: Float (0-100%) - lastFightDate: Date - recentFights: Array<FightId> (last 5) - updatedAt: Timestamp - academyId: UUID (nullable, for academy-specific rankings) - regionId: UUID (nullable, for regional rankings)
Organization
- id: UUID - name: String - email: String - phone: String - website: URL - logo: URL - description: Text - city: String - state: String - createdAt: Timestamp - updatedAt: Timestamp - subscription: Enum (FREE, CHAMPION, LEGEND) - subscriptionExpiresAt: DateTime
Academy
- id: UUID - name: String - city: String - state: String - phone: String - website: URL - coach: String - createdAt: Timestamp - updatedAt: Timestamp
🔄 User Flows
Event Organizer Flow
Flow 1: Create Event

Click "Create Event"
Fill event details (name, date, location, modalities)
Select weight classes for each modality (or use defaults)
Review and publish
Event page generated automatically
Flow 2: Create Fight Card

Open event
Click "Add Fight"
Multi-step modal:
Select modality and weight class
Drag athletes into fight (with Tale of the Tape)
Configure rules
Review and confirm
Fight appears in card, can be reordered
Flow 3: Record Results

During/after event, click "Record Result"
Select fight from card
Choose winner and win method
Enter round/time if applicable
Add judge scores (if applicable)
Confirm
Ranking updates automatically
Result published to public page
Athlete Flow
Flow 1: Discover & Join Event

Open app/website
Browse upcoming events by location/modality
Click event to see details
Click "Register" or "Express Interest"
Fill registration form
Receive confirmation
Flow 2: View Results

After fight, receive notification
Open app to see result
Click "Share Result"
Choose platform (Instagram, Twitter, etc.)
Pre-filled caption with ranking info
Share to social media
Event and Rankor get attribution
Flow 3: Track Progress

Open profile
View complete fight history
Check current ranking
See ranking progression chart
Compare with other athletes
View upcoming events in weight class
💰 Monetization Model
Free Plan ("Lutador")
Up to 50 athletes per event
Up to 20 fights per event
Basic ranking system
Public event page
QR code generation
Limitations: No custom branding, no ticket sales, no advanced analytics
Premium Plan ("Campeão")
$99/month or $990/year (17% discount)
Unlimited athletes
Unlimited fights
Advanced ranking with filters
Custom event page branding
Integrated ticket sales
Detailed analytics and reports
Email support
Enterprise Plan ("Lenda")
$299/month or $2,990/year (17% discount)
All Premium features, plus:
Intelligent matchmaking API
Custom integrations and webhooks
Priority support (chat + phone)
Custom analytics and reports
Team management (multiple users)
Advanced athlete analytics
Revenue Streams
Subscription fees from event organizers
Transaction fees on ticket sales (5-10%)
Premium athlete profiles (future)
Sponsorship/partnership commissions (future)
API usage fees for enterprise integrations (future)
🚀 Growth & Virality Engine
How Rankor Grows Organically
Athlete-Driven Growth:

Athlete wins fight → ranking updates
Athlete sees new ranking → feels motivated
Athlete shares result on social media
Post includes event name + Rankor branding
Friends/followers see the post
New athletes discover Rankor
New athletes search for events
New athletes register for events
Events grow in size and prestige
Organizers see success → upgrade to premium
Network Effects:

Each new athlete increases platform value for all other athletes
Each new event creates more ranking opportunities
Rivalries develop → rematch demand → more events
Athletes become invested in their Rankor profile → regular engagement
Viral Mechanics:

Social sharing with event attribution
Ranking badges for top athletes
Public leaderboards by region/academy
Email notifications for ranking changes
"Challenge" feature (athlete A challenges athlete B)
🛠️ Technical Considerations
Architecture Principles
Modular Modality System: New fighting styles can be added without code changes
Real-time Updates: WebSocket support for live ranking updates
Scalability: Designed to handle thousands of events and athletes
Data Integrity: All fight results immutable once recorded
Privacy: Athlete profiles can be private; organizers control data visibility
Integration Points
Social Media APIs: Instagram, Twitter, Facebook for sharing
Payment Processing: Stripe for ticket sales and subscriptions
Email Service: SendGrid or similar for notifications
Cloud Storage: AWS S3 or similar for photos and documents
Analytics: Mixpanel or Amplitude for user behavior tracking
Performance Considerations
Ranking calculations optimized with caching
Fight search/filter indexed for speed
Image optimization for mobile
CDN for static assets
Database sharding by event/region for scalability
📱 Platform Requirements
Web Application
Modern responsive design (mobile-first)
Dark theme with red accents (Rankor brand)
Real-time updates with WebSockets
Progressive Web App (PWA) capabilities
SEO optimized for event discovery
Mobile App (iOS & Android)
Native or React Native
Offline support for fight entry
Camera integration for athlete photos
Biometric login
Push notifications
Deep linking to events and athletes
Admin Dashboard
Event analytics and reporting
User management
Modality configuration
Dispute resolution
Payment and subscription management
🎯 Success Metrics
For Rankor
Monthly Active Users (MAU)
Event creation rate
Fights recorded per month
Subscription conversion rate
Revenue per organizer
User retention rate
For Organizers
Event attendance growth
Athlete registration growth
Event professionalism score (feedback)
Sponsorship inquiries
Revenue from ticket sales
For Athletes
Profile views
Ranking position improvement
Social media engagement on shared results
Event participation frequency
Network growth (followers)
🔮 Future Roadmap
Phase 2:

Live streaming integration
Athlete merchandise store
Sponsorship marketplace
Advanced matchmaking AI
Phase 3:

International expansion
Federation partnerships
Professional league integration
Fantasy fighting game
Phase 4:

Blockchain-based achievement NFTs
Metaverse fighting tournaments
AR athlete profiles
AI-powered coaching insights
🎓 Brand Voice & Positioning
Brand Personality
Competitive: Challenges the status quo
Energetic: Fast-paced, dynamic
Challenging: Pushes athletes and organizers to be better
Direct: No fluff, straight to the point
Irreverent (with athletes): Playful, provocative
Professional (with organizers): Consultative, strategic
Key Messaging
"Todo amador merece palco" (Every amateur deserves a stage)
"Treino é treino. Rankor é guerra" (Training is training. Rankor is war)
"Você não é só um competidor. É um nome no ranking" (You're not just a competitor. You're a name in the ranking)
"Chega de evento sem histórico. Chega de luta perdida no tempo" (No more events without history. No more fights lost in time)