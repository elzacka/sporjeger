# Sporjeger Google Sheets Template
## Enhanced with OSINT Framework Hierarchical Categories

This template provides a complete structure for your Sporjeger Google Sheets database, inspired by the OSINT Framework's hierarchical organization while maintaining your rich metadata.

---

## **Sheet Setup Instructions**

### **1. Create New Google Sheet**
- Go to [Google Sheets](https://sheets.google.com)
- Create new spreadsheet
- Name it: "Sporjeger OSINT Tools Database"
- Create sheet named: "Ark 1"

### **2. Add Column Headers (Row 1)**

Copy this header row:

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Kategori | Navn | URL | Beskrivelse | Kostnad | Språk | Krever Registrering | Designkvalitet | Vanskelighetsgrad | Veiledning | Endre eller slette | Tool Type | Platform | Tags | Category Path | Last Verified | Alternatives |

---

## **OSINT Framework-Inspired Category Hierarchy**

Based on OSINT Framework's structure, here are recommended hierarchical categories:

### **Main Categories (for Column A - Kategori)**

1. **Username**
2. **Email Address**
3. **Domain Name**
4. **IP Address**
5. **Phone Numbers**
6. **Social Media**
7. **Images**
8. **Videos**
9. **Documents**
10. **Geolocation**
11. **Search Engines**
12. **People Search**
13. **Public Records**
14. **Business Records**
15. **Transportation**
16. **Government**
17. **Dark Web**

### **Hierarchical Structure (for Column O - Category Path)**

Use comma-separated paths to create hierarchy:

#### **Username**
```
Username
Username, Social Media
Username, Gaming
Username, Forums
Username, Check Availability
```

#### **Email Address**
```
Email Address
Email Address, Verification
Email Address, Breach Check
Email Address, SMTP Lookup
Email Address, Email Hunter
```

#### **Domain Name**
```
Domain Name
Domain Name, Whois
Domain Name, DNS Lookup
Domain Name, Subdomain Search
Domain Name, Certificate Search
Domain Name, Historical Data
```

#### **IP Address**
```
IP Address
IP Address, Geolocation
IP Address, Reputation Check
IP Address, Port Scanning
IP Address, ASN Lookup
```

#### **Phone Numbers**
```
Phone Numbers
Phone Numbers, Reverse Lookup
Phone Numbers, Carrier Lookup
Phone Numbers, Validation
```

#### **Social Media**
```
Social Media
Social Media, Twitter
Social Media, Facebook
Social Media, LinkedIn
Social Media, Instagram
Social Media, TikTok
Social Media, YouTube
Social Media, Reddit
Social Media, Telegram
```

#### **Images**
```
Images
Images, Reverse Search
Images, Metadata Extraction
Images, Forensics
Images, Face Recognition
Images, Geolocation
```

#### **Videos**
```
Videos
Videos, Metadata
Videos, Download
Videos, Forensics
Videos, Verification
```

#### **Documents**
```
Documents
Documents, Metadata
Documents, PDF Analysis
Documents, Office Files
Documents, Search
```

#### **Geolocation**
```
Geolocation
Geolocation, Maps
Geolocation, Street View
Geolocation, Coordinates
Geolocation, Satellite
Geolocation, Flight Tracking
Geolocation, Marine Tracking
```

#### **Search Engines**
```
Search Engines
Search Engines, General
Search Engines, Code Search
Search Engines, Academic
Search Engines, People
Search Engines, IoT Devices
```

#### **People Search**
```
People Search
People Search, General
People Search, Professional
People Search, Electoral
People Search, Obituaries
```

#### **Public Records**
```
Public Records
Public Records, Court Records
Public Records, Property
Public Records, Licenses
Public Records, Patents
```

#### **Business Records**
```
Business Records
Business Records, Company Info
Business Records, Trademark
Business Records, Financial
Business Records, Directors
```

---

## **Sample Data Rows**

Here are example entries with the new hierarchical structure:

### **Example 1: Twitter Search Tool**

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Social Media | Twitter Advanced Search | https://twitter.com/search-advanced | Avansert søk på Twitter med filtre for dato, språk, og mer | GRATIS | GBR | Delvis | 2 | 2 | # Twitter Advanced Search Guide\n\nUse operators like:\n- `from:username`\n- `to:username`\n- `since:2024-01-01` | | web | web | twitter, x, social, search operators | Social Media, Twitter | 2025-01-15 | TweetDeck, Nitter |

### **Example 2: Sherlock Username Tool**

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Username | Sherlock | https://github.com/sherlock-project/sherlock | Søk etter brukernavn på 300+ sosiale medier | GRATIS | USA | Nei | 2 | 3 | # Sherlock Installation\n\n```bash\npip install sherlock-project\nsherlock username\n``` | | terminal | all | username, social media, python, cli | Username, Social Media | 2025-01-10 | WhatsMyName, Namechk |

### **Example 3: Have I Been Pwned**

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Email Address | Have I Been Pwned | https://haveibeenpwned.com | Sjekk om e-postadressen er kompromittert i datainnbrudd | GRATIS | GBR | Nei | 3 | 1 | # Using HIBP\n\nEnter email and check against database of known breaches. | | web | web | email, breach, security, passwords | Email Address, Breach Check | 2025-01-18 | DeHashed, LeakCheck |

### **Example 4: Whois Lookup**

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Domain Name | Domain Dossier | https://centralops.net/co/ | Komplett domene-analyse med whois, DNS, og mer | GRATIS | USA | Nei | 2 | 1 | | | web | web | whois, dns, domain, network | Domain Name, Whois | 2025-01-12 | DomainTools, who.is |

### **Example 5: Google Maps**

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Geolocation | Google Maps | https://maps.google.com | Kartverktøy for geografisk søk og Street View | GRATIS | NOR | Nei | 3 | 1 | # Google Maps Tips\n\n- Use coordinates: `59.9139, 10.7522`\n- Street View timeline for historical imagery | | web | all | maps, geolocation, street view, coordinates | Geolocation, Maps | 2025-01-20 | OpenStreetMap, Bing Maps |

### **Example 6: TinEye Reverse Image Search**

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Images | TinEye | https://tineye.com | Omvendt bildesøk for å finne kilder og versjoner | GRATISH | GBR | Nei | 2 | 2 | | | web | web | reverse image, search, verification | Images, Reverse Search | 2025-01-14 | Google Images, Yandex Images |

### **Example 7: Shodan IoT Search**

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Search Engines | Shodan | https://shodan.io | Søkemotor for IoT-enheter og internett-tilkoblede systemer | GRATISH | USA | Ja | 2 | 4 | # Shodan Search Examples\n\n- `product:MySQL`\n- `country:NO`\n- `port:22` | | web | web | iot, security, devices, network scanning | Search Engines, IoT Devices | 2025-01-16 | Censys, ZoomEye |

---

## **Column Definitions**

### **A - Kategori** (Required)
Top-level category. Choose from main categories list above.
- Example: `Social Media`, `Username`, `Email Address`

### **B - Navn** (Required)
Tool name
- Example: `Twitter Advanced Search`, `Sherlock`

### **C - URL** (Required)
Direct link to the tool
- Example: `https://twitter.com/search-advanced`

### **D - Beskrivelse** (Required)
Brief description of what the tool does (Norwegian)
- Example: `Avansert søk på Twitter med filtre for dato, språk, og mer`

### **E - Kostnad** (Required)
Cost type. Must be one of:
- `GRATIS` - Free
- `KOSTNAD` - Paid
- `GRATISH` - Freemium (free with paid upgrades)

### **F - Språk** (Optional)
Language/country code
- Example: `NOR`, `USA`, `GBR`, `SWE`

### **G - Krever Registrering** (Optional)
Registration requirement. Must be one of:
- `Ja` - Yes, requires registration
- `Delvis` - Partial (some features free, some require registration)
- `Nei` - No registration needed

### **H - Designkvalitet** (Optional)
UI/UX quality rating (1-3)
- `1` - Basic/Simple
- `2` - Good
- `3` - Excellent

### **I - Vanskelighetsgrad** (Optional)
Difficulty level (1-5)
- `1` - Beginner
- `2` - Easy
- `3` - Intermediate
- `4` - Advanced
- `5` - Expert

### **J - Veiledning** (Optional)
Markdown-formatted guide
```markdown
# Tool Name Guide

## Getting Started
Instructions here...

## Tips
- Tip 1
- Tip 2
```

### **K - Endre eller slette** (Optional)
Admin notes - leave blank for normal tools

### **L - Tool Type** (Optional - NEW!)
Type of tool. Options:
- `web` - Web-based tool
- `terminal` - Command-line tool
- `dork` - Google Dork/search syntax
- `browser-extension` - Browser extension
- `api` - API service
- `mobile` - Mobile app

### **M - Platform** (Optional - NEW!)
Platform compatibility. Options:
- `web` - Web browser
- `windows` - Windows OS
- `mac` - macOS
- `linux` - Linux
- `mobile` - Mobile devices
- `all` - All platforms

### **N - Tags** (Optional - NEW!)
Comma-separated searchable keywords
- Example: `twitter, x, social, search operators`
- Example: `whois, dns, domain, network`

### **O - Category Path** (Optional - NEW!)
Hierarchical category path (comma-separated)
- Example: `Social Media, Twitter`
- Example: `Email Address, Breach Check`
- Example: `Geolocation, Maps`

**This creates the tree structure:**
```
Social Media
  └─ Twitter
Email Address
  └─ Breach Check
Geolocation
  └─ Maps
```

### **P - Last Verified** (Optional - NEW!)
Date when URL was last checked (ISO format)
- Example: `2025-01-15`

### **Q - Alternatives** (Optional - NEW!)
Comma-separated list of alternative/similar tools
- Example: `TweetDeck, Nitter`
- Example: `DomainTools, who.is`

---

## **Tool Type Quick Reference**

Add these markers to column L based on OSINT Framework convention:

| Type | Code | Description | Example Tools |
|------|------|-------------|---------------|
| Web | `web` | Browser-based | Twitter Search, Google Maps |
| Terminal | `terminal` | CLI/Command-line | Sherlock, theHarvester |
| Dork | `dork` | Search syntax | Google Dorks |
| Extension | `browser-extension` | Browser plugin | Wayback Machine extension |
| API | `api` | API service | Shodan API, Twitter API |
| Mobile | `mobile` | Mobile app | Mobile OSINT apps |

---

## **Complete Category Hierarchy Map**

This is the full hierarchical structure inspired by OSINT Framework:

```
├─ Username
│  ├─ Social Media
│  ├─ Gaming
│  ├─ Forums
│  └─ Check Availability
│
├─ Email Address
│  ├─ Verification
│  ├─ Breach Check
│  ├─ SMTP Lookup
│  └─ Email Hunter
│
├─ Domain Name
│  ├─ Whois
│  ├─ DNS Lookup
│  ├─ Subdomain Search
│  ├─ Certificate Search
│  └─ Historical Data
│
├─ IP Address
│  ├─ Geolocation
│  ├─ Reputation Check
│  ├─ Port Scanning
│  └─ ASN Lookup
│
├─ Phone Numbers
│  ├─ Reverse Lookup
│  ├─ Carrier Lookup
│  └─ Validation
│
├─ Social Media
│  ├─ Twitter
│  ├─ Facebook
│  ├─ LinkedIn
│  ├─ Instagram
│  ├─ TikTok
│  ├─ YouTube
│  ├─ Reddit
│  └─ Telegram
│
├─ Images
│  ├─ Reverse Search
│  ├─ Metadata Extraction
│  ├─ Forensics
│  ├─ Face Recognition
│  └─ Geolocation
│
├─ Videos
│  ├─ Metadata
│  ├─ Download
│  ├─ Forensics
│  └─ Verification
│
├─ Documents
│  ├─ Metadata
│  ├─ PDF Analysis
│  ├─ Office Files
│  └─ Search
│
├─ Geolocation
│  ├─ Maps
│  ├─ Street View
│  ├─ Coordinates
│  ├─ Satellite
│  ├─ Flight Tracking
│  └─ Marine Tracking
│
├─ Search Engines
│  ├─ General
│  ├─ Code Search
│  ├─ Academic
│  ├─ People
│  └─ IoT Devices
│
├─ People Search
│  ├─ General
│  ├─ Professional
│  ├─ Electoral
│  └─ Obituaries
│
├─ Public Records
│  ├─ Court Records
│  ├─ Property
│  ├─ Licenses
│  └─ Patents
│
└─ Business Records
   ├─ Company Info
   ├─ Trademark
   ├─ Financial
   └─ Directors
```

---

## **Import Instructions**

1. **Create your Google Sheet** with the header row
2. **Populate with your existing tools**, updating the Category Path column (O)
3. **Add new hierarchical categories** using the structure above
4. **Update tool types** in column L (web, terminal, dork, etc.)
5. **Add tags** in column N for better searchability
6. **Set sharing** to "Anyone with the link can view"
7. **Copy the Sheet ID** from the URL
8. **Update `.env.local`** with your new sheet ID

---

## **Migration from Current Sheet**

If you have existing data:

1. **Export current sheet** as CSV
2. **Create new sheet** with this template
3. **Import your data** into columns A-K
4. **Add new metadata**:
   - Column L: Add tool type (usually `web`)
   - Column M: Add platform (usually `web` or `all`)
   - Column N: Add relevant tags
   - **Column O: Add hierarchical category path** (most important!)
   - Column P: Add today's date as verification
   - Column Q: Add alternatives if known

### **Example Migration:**

**Old format:**
```
Kategori: Social Media
Navn: Twitter Search
URL: https://twitter.com/search
```

**New format:**
```
Kategori: Social Media
Navn: Twitter Search
URL: https://twitter.com/search
Tool Type: web
Platform: web
Tags: twitter, x, social, search
Category Path: Social Media, Twitter
Last Verified: 2025-01-22
Alternatives: TweetDeck, Nitter
```

---

## **Next Steps**

1. ✅ Copy this template structure to your Google Sheet
2. ✅ Populate with your OSINT tools
3. ✅ Use hierarchical categories in Column O
4. ✅ Run `npm run fetch-tools` to generate static JSON
5. ✅ View your enhanced Sporjeger with tree navigation!

---

**Your Sporjeger is now enhanced with OSINT Framework's organizational structure while keeping all your rich metadata! 🎉**
