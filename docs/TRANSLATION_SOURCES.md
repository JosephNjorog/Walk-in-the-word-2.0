# Bible Translation Sources Guide

This document lists where to obtain each of the requested Bible translations for import into Walk in the Word.

## ✅ Available Translations

### 1. King James Version (KJV) - English
- **Status**: ✅ Already Imported (31,100 verses)
- **Source**: Bible JSON Project
- **License**: Public Domain

---

## 📥 Free & Open Translations

### 2. World English Bible (WEB) - English
- **Alternative to**: NIV, ESV, NLT
- **Source**: https://worldenglish.bible/
- **Download**: https://github.com/scrollmapper/bible_databases
- **License**: Public Domain
- **Format**: SQL or JSON
- **Command**: 
  ```bash
  curl -o data/en_web.json https://raw.githubusercontent.com/thiagobodruk/bible/master/json/en_web.json
  npm run import-bible -- --version=WEB --file=./data/en_web.json
  ```

### 3. Bible in Basic English (BBE) - English
- **Alternative to**: NLT (simple English)
- **Source**: Bible JSON Project
- **Download**: https://raw.githubusercontent.com/thiagobodruk/bible/master/json/en_bbe.json
- **License**: Public Domain
- **Command**:
  ```bash
  curl -o data/en_bbe.json https://raw.githubusercontent.com/thiagobodruk/bible/master/json/en_bbe.json
  npm run import-bible -- --version=BBE --file=./data/en_bbe.json
  ```

### 4. Reina-Valera 1909 (RV1909) - Spanish
- **Source**: Bible JSON Project
- **Download**: https://raw.githubusercontent.com/thiagobodruk/bible/master/json/es_rv1909.json
- **License**: Public Domain
- **Command**:
  ```bash
  curl -o data/es_rv1909.json https://raw.githubusercontent.com/thiagobodruk/bible/master/json/es_rv1909.json
  npm run import-bible -- --version=RV1909 --file=./data/es_rv1909.json
  ```

### 5. João Ferreira de Almeida (Almeida) - Portuguese
- **Source**: Bible JSON Project
- **Download**: https://raw.githubusercontent.com/thiagobodruk/bible/master/json/pt_almeida.json
- **License**: Public Domain
- **Command**:
  ```bash
  curl -o data/pt_almeida.json https://raw.githubusercontent.com/thiagobodruk/bible/master/json/pt_almeida.json
  npm run import-bible -- --version=Almeida --file=./data/pt_almeida.json
  ```

### 6. Louis Segond (LSG) - French
- **Source**: Bible JSON Project
- **Download**: https://raw.githubusercontent.com/thiagobodruk/bible/master/json/fr_lsg.json
- **License**: Public Domain
- **Command**:
  ```bash
  curl -o data/fr_lsg.json https://raw.githubusercontent.com/thiagobodruk/bible/master/json/fr_lsg.json
  npm run import-bible -- --version=LSG --file=./data/fr_lsg.json
  ```

### 7. Luther Bible 1912 (Luther) - German
- **Source**: Bible JSON Project
- **Download**: https://raw.githubusercontent.com/thiagobodruk/bible/master/json/de_luther1912.json
- **License**: Public Domain
- **Command**:
  ```bash
  curl -o data/de_luther1912.json https://raw.githubusercontent.com/thiagobodruk/bible/master/json/de_luther1912.json
  npm run import-bible -- --version=Luther1912 --file=./data/de_luther1912.json
  ```

### 8. Chinese Union Version (CUV) - Chinese
- **Source**: Bible SuperSearch API or CBOL
- **Download**: https://github.com/bibleapi/bibleapi-bibles-json (if available)
- **License**: Varies
- **Command**:
  ```bash
  # Manual download required - see Chinese Bible Online
  npm run import-bible -- --version=CUV --file=./data/zh_cuv.json
  ```

---

## 🔒 Copyrighted Translations (Require Permission/License)

### 9. New International Version (NIV) - English
- **Copyright**: Biblica, Inc.
- **Source**: Requires commercial license
- **API Option**: Available through API.bible (requires API key)
- **Cost**: Contact Biblica for licensing
- **Note**: Cannot be freely redistributed

### 10. New Living Translation (NLT) - English
- **Copyright**: Tyndale House Publishers
- **Source**: Requires commercial license
- **API Option**: Available through API.bible (requires API key)
- **Cost**: Contact Tyndale for licensing
- **Note**: Cannot be freely redistributed

### 11. English Standard Version (ESV) - English
- **Copyright**: Crossway Bibles
- **Source**: Requires commercial license
- **API Option**: ESV API (https://api.esv.org/)
- **Cost**: Free API with restrictions, commercial license for full use
- **Note**: Cannot be freely redistributed

### 12. New Revised Standard Version (NRSV) - English
- **Copyright**: National Council of Churches
- **Source**: Requires commercial license
- **API Option**: Limited availability
- **Cost**: Contact NCC for licensing
- **Note**: Cannot be freely redistributed

### 13. New American Bible (NAB/NABRE) - English
- **Copyright**: Confraternity of Christian Doctrine (USCCB)
- **Source**: https://bible.usccb.org/
- **API Option**: USCCB may provide API access
- **Cost**: Contact USCCB for licensing
- **Note**: Cannot be freely redistributed

### 14. Jerusalem Bible / New Jerusalem Bible - English
- **Copyright**: Darton, Longman & Todd / Doubleday
- **Source**: Requires commercial license
- **Cost**: Contact publishers for licensing
- **Note**: Cannot be freely redistributed

### 15. Revised Standard Version - Catholic Edition (RSV-CE) - English
- **Copyright**: National Council of Churches / Ignatius Press
- **Source**: Requires commercial license
- **Cost**: Contact Ignatius Press for licensing
- **Note**: Cannot be freely redistributed

---

## 🌍 Regional Translations (Need Research)

### 16. Swahili Union Version (UV) - Swahili
- **Source**: Bible Society of Tanzania/Kenya
- **Download**: May require contacting Bible societies
- **License**: Unknown - needs verification
- **Alternative**: Habari Njema (Good News Swahili)

### 17. Biblia Habari Njema (Good News) - Swahili
- **Source**: Bible Society of Tanzania
- **Download**: May be available through Bible societies
- **License**: Needs verification

### 18. Septuagint (LXX) - Greek
- **Source**: CCAT (University of Pennsylvania)
- **Download**: https://github.com/openscriptures/GreekResources
- **License**: Public Domain (ancient text)
- **Format**: May require conversion
- **Alternative**: https://www.academic-bible.com/en/online-bibles/septuagint-lxx/

---

## 🚀 Recommended Import Order

Based on availability and licensing:

1. ✅ **King James Version (KJV)** - Already imported
2. **World English Bible (WEB)** - Free, public domain, good modern English
3. **Bible in Basic English (BBE)** - Free, simple English
4. **Reina-Valera 1909 (RV1909)** - Free Spanish translation
5. **Louis Segond (LSG)** - Free French translation
6. **Luther Bible 1912** - Free German translation
7. **Almeida** - Free Portuguese translation

For copyrighted translations (NIV, ESV, NLT, etc.), consider:
- Using API.bible with API keys (rate limited)
- Contacting publishers for licensing
- Using as read-only through APIs without storing locally

---

## 📦 Bulk Download Script

```bash
# Download all free public domain translations
cd data

# English
curl -O https://raw.githubusercontent.com/thiagobodruk/bible/master/json/en_web.json
curl -O https://raw.githubusercontent.com/thiagobodruk/bible/master/json/en_bbe.json

# Spanish
curl -O https://raw.githubusercontent.com/thiagobodruk/bible/master/json/es_rv1909.json

# Portuguese
curl -O https://raw.githubusercontent.com/thiagobodruk/bible/master/json/pt_almeida.json

# French
curl -O https://raw.githubusercontent.com/thiagobodruk/bible/master/json/fr_lsg.json

# German
curl -O https://raw.githubusercontent.com/thiagobodruk/bible/master/json/de_luther1912.json

# Return to root
cd ..

# Import all translations
npm run import-bible -- --version=WEB --file=./data/en_web.json
npm run import-bible -- --version=BBE --file=./data/en_bbe.json
npm run import-bible -- --version=RV1909 --file=./data/es_rv1909.json
npm run import-bible -- --version=Almeida --file=./data/pt_almeida.json
npm run import-bible -- --version=LSG --file=./data/fr_lsg.json
npm run import-bible -- --version=Luther1912 --file=./data/de_luther1912.json
```

---

## 📋 Alternative Sources

### Open Bible Data
- **Repository**: https://github.com/scrollmapper/bible_databases
- **Format**: SQL dumps
- **Coverage**: Multiple translations
- **Requires**: Conversion to JSON format

### Bible SuperSearch
- **Repository**: https://github.com/Bible-Projects/believers-sword-next
- **Format**: JSON API
- **Coverage**: Many translations
- **Requires**: API setup

### eBible.org
- **Website**: https://ebible.org/
- **Format**: USFM, OSIS, HTML
- **Coverage**: 1000+ translations
- **License**: Varies by translation
- **Requires**: Format conversion

### Crosswire (Sword Project)
- **Website**: https://www.crosswire.org/sword/modules/
- **Format**: Proprietary Sword format
- **Coverage**: 200+ modules
- **Requires**: Conversion tool

---

## ⚖️ Legal Considerations

### Public Domain Translations ✅
- KJV, WEB, BBE, RV1909, Luther 1912, LSG, Almeida
- Can be freely distributed, modified, and used commercially

### Copyrighted Translations ⚠️
- NIV, ESV, NLT, NRSV, NAB, Jerusalem, RSV-CE
- Require licensing for distribution
- API access may be available with restrictions
- Cannot store/cache long-term without permission

### Best Practice
- Start with public domain translations
- Use APIs for copyrighted translations (if available)
- Always credit the translation and copyright holders
- Include copyright notices in the UI

---

## 🔄 Next Steps

1. Import available free translations (WEB, BBE, RV1909, LSG, Luther)
2. Research licensing for copyrighted translations
3. Contact Bible societies for regional translations (Swahili, Chinese)
4. Set up API.bible integration for copyrighted translations
5. Document attribution requirements in UI

---

## 📞 Contact Information

### For Licensing Inquiries

- **Biblica (NIV)**: https://www.biblica.com/bible/license-a-bible-translation/
- **Crossway (ESV)**: https://www.crossway.org/permissions/
- **Tyndale (NLT)**: https://www.tyndale.com/permissions
- **USCCB (NAB)**: https://www.usccb.org/offices/new-american-bible/permissions
- **Bible Societies**: https://www.unitedbiblesocieties.org/

---

**Last Updated**: January 8, 2026
