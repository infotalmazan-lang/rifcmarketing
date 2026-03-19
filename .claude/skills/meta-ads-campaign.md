# Skill: /meta-ads-campaign

## Trigger
This skill runs when the user types: `/meta-ads-campaign <client-slug> <objective>`

Example: `/meta-ads-campaign talmazan-school leads`

## Arguments
- `$1` = client slug (must exist in `clients` table)
- `$2` = campaign objective: `leads` | `traffic` | `awareness` | `conversions`

---

## PHASE 1 — Gather Context

### 1.1 Load client from database
```sql
SELECT id, name, slug FROM clients WHERE slug = '$1';
```
If no row found → stop and say: "Client '$1' not found. Add it to the clients table first."

### 1.2 Load ad account mapping
```sql
SELECT account_id, account_name
FROM ad_account_mappings
WHERE client_id = '<client_id>'
  AND platform = 'meta_ads'
  AND is_active = true
LIMIT 1;
```
If no row found → stop and say: "No active Meta ad account mapped for this client."

### 1.3 Ask the user these questions (one block, conversational):
1. **Geographic targeting** — What country/region? (e.g., "Romania", "Moldova", "Romania + Moldova")
2. **Age range** — e.g., "25-55"
3. **Daily budget** — e.g., "$20/day" or "100 RON/day"
4. **Landing page URL** — Where do clicks go?
5. **Funnel structure** — Single ad set OR split by funnel stage (TOF / MOF / BOF)?
6. **Video assets** — List the full file paths to your MP4 video files. For each video, also tell me: title, format (vertical/feed/landscape), and funnel stage.

Wait for all answers before proceeding.

---

## PHASE 2 — Create Campaign Record

### 2.1 Validate geographic targeting via Meta API
Before inserting anything, look up the correct region key:
```
GET https://graph.facebook.com/v21.0/search?type=adgeolocation&location_types=region&q=<region_name>&access_token={META_ACCESS_TOKEN}
```
Confirm the `key`, `country_code`, and `name` are correct. Show the result to the user and ask them to confirm.

### 2.2 Validate all video file paths exist
For each video path provided, check that the file exists and is readable. If any file is missing, stop and list the missing paths.

### 2.3 Insert campaign record
```sql
INSERT INTO ad_campaigns (
  client_id, objective, status,
  geo_country, geo_region_key,
  age_min, age_max,
  daily_budget_cents,
  landing_page_url,
  funnel_structure,
  campaign_name
)
VALUES (
  '<client_id>',
  '$2',
  'draft',
  '<country_code>',
  '<region_key>',
  <age_min>,
  <age_max>,
  <budget_in_cents>,  -- convert dollars/RON to cents automatically
  '<landing_page_url>',
  '<single|split>',
  '<client-slug>-<month>-<year>-$2'  -- e.g. talmazan-school-march-2026-leads
)
RETURNING id;
```

### 2.4 Insert video asset records
For each video:
```sql
INSERT INTO video_ad_units (
  campaign_id, video_title, file_path,
  format, funnel_stage, status
)
VALUES (
  '<campaign_id>',
  '<title>',
  '<file_path>',
  '<vertical|feed|landscape>',
  '<tof|mof|bof>',
  'draft'
)
RETURNING id;
```

---

## PHASE 3 — Generate Ad Copy

For each video ad unit, generate:
- **Primary text** (125 chars max, conversational, hook in first line)
- **Headline** (27 chars max, benefit-driven)
- **Description** (27 chars max, supporting detail)
- **CTA type**: one of `LEARN_MORE` | `SIGN_UP` | `GET_QUOTE` | `CONTACT_US` | `SHOP_NOW`

Present each ad for review:
```
─────────────────────────────────
Ad: "<video_title>" [<format> / <funnel_stage>]
─────────────────────────────────
Primary text:
<generated text>

Headline: <headline>
Description: <description>
CTA: <CTA_TYPE>
─────────────────────────────────
Approve? (y/n/rewrite)
```

Wait for explicit approval on EACH ad. If user says "rewrite", ask what to change and regenerate. Only save after approval:

```sql
UPDATE video_ad_units
SET primary_text = '<text>',
    headline = '<headline>',
    description = '<description>',
    cta_type = '<CTA>',
    copy_approved = true
WHERE id = '<unit_id>';
```

---

## PHASE 4 — Generate UTMs

For each approved ad unit, generate the UTM tracking URL.

### Naming convention:
- **utm_source**: `meta`
- **utm_medium**: `paid_social`
- **utm_campaign**: `<client-slug>-<month>-<year>-<objective>` (e.g. `talmazan-school-march-2026-leads`)
- **utm_content**: `v1-<funnel_stage>-<descriptive-slug>` (e.g. `v1-tof-rate-hikes-hook`)

Rules:
- All lowercase, hyphen-separated
- No tool names (never "claude", "meta", "remotion")
- No redundant date suffixes

Full URL format:
```
<landing_page>?utm_source=meta&utm_medium=paid_social&utm_campaign=<slug>&utm_content=<content_tag>
```

Show all UTMs to user for review. Save after confirmation:
```sql
UPDATE video_ad_units
SET utm_url = '<full_url>',
    utm_content = '<content_tag>'
WHERE id = '<unit_id>';
```

---

## PHASE 5 — Pre-Deploy Checklist

Present this checklist. Do NOT proceed until user explicitly types "DEPLOY" or "yes, deploy".

```
PRE-DEPLOY CHECKLIST
════════════════════════════════════════
[ ] All video files exist at their paths
[ ] All ad copy reviewed and approved
[ ] UTM URLs are clean and correct
[ ] Geographic targeting validated via API
[ ] Landing page is live (test the URL)
[ ] Facebook Page ID is set in .env
[ ] Ad account mapping is active in DB
[ ] Daily budget is set correctly
[ ] Campaign objective matches business goal
[ ] No Special Ad Category violations (housing, credit, employment, politics?)
════════════════════════════════════════
Campaign: <campaign_name>
Client: <client_name>
Account: <account_id>
Videos: <count> ads
Budget: <budget>/day
Geo: <geo_target>
════════════════════════════════════════
Type DEPLOY to proceed or CANCEL to stop.
```

If user types CANCEL → set campaign status to 'draft' and stop.
If user types DEPLOY → update status and continue:
```sql
UPDATE ad_campaigns SET status = 'ready' WHERE id = '<campaign_id>';
```

---

## PHASE 6 — Deploy to Meta

Use `META_ACCESS_TOKEN` from environment. Use `META_PAGE_ID` from environment.

### 6.1 Upload Videos
For each video_ad_unit, upload via Graph API:
```
POST https://graph.facebook.com/v21.0/<account_id>/advideos
  file_url OR file (multipart upload)
  title: <video_title>
  access_token: {META_ACCESS_TOKEN}
```

If `meta_video_id` already exists in DB for this unit → SKIP (resume support).

Save returned video ID:
```sql
UPDATE video_ad_units SET meta_video_id = '<returned_id>' WHERE id = '<unit_id>';
```

Log each step:
```sql
INSERT INTO ad_deploy_log (campaign_id, action, status, response_data)
VALUES ('<campaign_id>', 'video_upload', 'success', '<json_response>');
```

### 6.2 Create Campaign
```
POST https://graph.facebook.com/v21.0/<account_id>/campaigns
  name: <campaign_name>
  objective: <OUTCOME_LEADS|OUTCOME_TRAFFIC|OUTCOME_AWARENESS|OUTCOME_SALES>
  status: PAUSED
  special_ad_categories: []
  access_token: {META_ACCESS_TOKEN}
```

Save:
```sql
UPDATE ad_campaigns SET meta_campaign_id = '<id>', status = 'deployed' WHERE id = '<campaign_id>';
```

### 6.3 Auto-Discover Pixel
```
GET https://graph.facebook.com/v21.0/<account_id>/adspixels?access_token={META_ACCESS_TOKEN}
```
Save pixel ID if found. Log warning if not found (deploy continues).

### 6.4 Create Ad Set
```
POST https://graph.facebook.com/v21.0/<account_id>/adsets
  name: <client-slug>-adset-<objective>
  campaign_id: <meta_campaign_id>
  daily_budget: <budget_in_cents>
  billing_event: IMPRESSIONS
  optimization_goal: <LEAD_GENERATION|LINK_CLICKS|REACH|OFFSITE_CONVERSIONS>
  targeting: {
    geo_locations: { regions: [{ key: "<region_key>" }] },
    age_min: <age_min>,
    age_max: <age_max>,
    targeting_automation: { advantage_audience: 1 }
  }
  promoted_object: { pixel_id: "<pixel_id>", custom_event_type: "LEAD" }
  status: PAUSED
  access_token: {META_ACCESS_TOKEN}
```

Save:
```sql
UPDATE ad_campaigns SET meta_adset_id = '<id>' WHERE id = '<campaign_id>';
```

### 6.5 Create Ad Creatives & Ads
For each video_ad_unit:

**Create creative:**
```
POST https://graph.facebook.com/v21.0/<account_id>/adcreatives
  name: <video_title>-creative
  object_story_spec: {
    page_id: {META_PAGE_ID},
    video_data: {
      video_id: <meta_video_id>,
      message: <primary_text>,
      title: <headline>,
      call_to_action: { type: <cta_type>, value: { link: <utm_url> } }
    }
  }
  access_token: {META_ACCESS_TOKEN}
```

**Create ad:**
```
POST https://graph.facebook.com/v21.0/<account_id>/ads
  name: <video_title>
  adset_id: <meta_adset_id>
  creative: { creative_id: <creative_id> }
  status: PAUSED
  access_token: {META_ACCESS_TOKEN}
```

Save:
```sql
UPDATE video_ad_units
SET meta_creative_id = '<creative_id>',
    meta_ad_id = '<ad_id>',
    status = 'deployed'
WHERE id = '<unit_id>';
```

### 6.6 Final Summary
After all ads are deployed, show:
```
════════════════════════════════════════
DEPLOY COMPLETE ✓
════════════════════════════════════════
Campaign:   <campaign_name> [PAUSED]
Ad Set:     <adset_name> [PAUSED]
Ads:        <count> created, all PAUSED
Pixel:      <pixel_id or "NOT FOUND — add manually">
Budget:     <budget>/day
Geo:        <geo_target>
════════════════════════════════════════
Next: Open Meta Ads Manager, review everything, then ACTIVATE when ready.
════════════════════════════════════════
```

---

## Error Handling

- **Video upload fails** → log error, skip to next video, report at end
- **Campaign creation fails** → set `status = 'error'` in DB, stop deploy, show error
- **Partial failure** → user can reset and re-run:
  ```sql
  UPDATE ad_campaigns SET status = 'ready', deploy_error = NULL WHERE id = '<id>';
  ```
- **Token expired** → show message: "Token invalid or expired. Regenerate a system user token at business.facebook.com/settings"
- **App not approved** → show message: "Meta app is in Development Mode. For production, switch to Live mode at developers.facebook.com"

---

## Environment Variables Required

```
META_ACCESS_TOKEN=   # System user token (never expires)
META_PAGE_ID=        # Facebook Page ID for the client
```

These are read from the project `.env` file automatically by Claude Code.
