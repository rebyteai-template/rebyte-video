# X Posting Strategy

Use this file before each daily X run. Keep durable strategy here. Keep date-specific findings and executed actions in `x-daily/YYYY-MM-DD.md`.

## Operating Rules

1. Use the dedicated CCTools browser session for X automation.
   - Connect only to CDP port `9333`.
   - Do not use the user's private Chrome or CDP port `9222`.
   - Do not use auto-connect.
   - Use the Chrome/profile associated with `sonicgg@gmail.com`.
   - If X appears logged out, verify the `sonicgg@gmail.com` profile/tab first.
   - If the active tab is unrelated, list tabs and switch to the intended X tab explicitly.
   - Keep browser automation in the background by default. Do not bring CCTools Chrome to the foreground unless CJ explicitly asks to see it.

2. Keep public actions human-approved.
   - Allowed without approval: open pages, search, read timelines, capture visible text, collect public links, draft replies, draft posts, classify candidates.
   - Requires explicit approval: post, reply, quote, follow, unfollow, like, repost, bookmark, DM, join/leave communities, or change settings.
   - Approval must include the exact account, target, and text/action.

3. Confirm the active account before any public action.
   - Company: `Rebyte` / `@rebyteai`.
   - Personal: `CJ` / `@m00rphic`.
   - Avoid using old session state. Open the account menu when there is any doubt.
   - An unrelated session previously used `jian cai` / `@meowooooof`; do not use it for Rebyte X work.

## Account Choice

Use `@rebyteai` for:

- Product announcements.
- Rebyte feature positioning.
- Docs, API, MCP, employee workflow, and official support-style replies.
- Company-facing replies where the product context is useful.

Use `@m00rphic` for:

- Founder takes.
- Informal technical opinions.
- Market observations.
- Stronger disagreements or sharper framing.
- Relationship-building replies where the company logo would feel promotional.
- Community posting, unless CJ explicitly wants the company account.

When uncertain, draft both versions and let CJ choose.

## Daily Routine

1. Verify browser, profile, and active account.
2. Open or create `x-daily/YYYY-MM-DD.md`.
3. Review the previous day's note for unfinished candidates.
4. Check recent `@rebyteai` posts.
5. For important company posts, check whether `@m00rphic` has reposted them.
6. Run the relationship-driven scan:
   - Home / Following.
   - Followed accounts with strong AI, developer-tool, founder, or infra signal.
   - Existing high-signal targets from prior notes.
7. Run the topic-driven scan:
   - `K3 Codex Claude Code`
   - `coding agents open source model`
   - `MCP agent harness`
   - `agent harness OR MCP filter:follows`
8. Run the big-account reply loop:
   - Find large relevant AI / developer / founder accounts.
   - Open high-performing, fresh posts.
   - Read comments for openings where Rebyte can add a precise technical point.
   - Look for second-order people in comments who are worth following or replying to.
9. Run the community distribution check for approved top-level posts.
10. For product posts, create an animation asset before staging the post.
11. Draft recommended actions and wait for approval.
12. Execute only approved public actions.
13. Record every result in the daily note, including URLs, account used, community used, media asset path, and whether the action was only a draft or actually sent.

## Strategy: Company Post Plus Personal Amplification

For important posts from `@rebyteai`:

1. Open the company post URL.
2. Switch to `@m00rphic`.
3. Check whether it is already reposted.
4. Prefer a plain repost for product announcements.
5. Use a quote only when CJ wants a founder take layered on top.
6. Record the company post URL and the personal repost result.

## Strategy: Public Community Distribution

Use this after a top-level post is approved and published, not for every reply.

Current confirmed communities for `@m00rphic`:

- `AI Math` - https://x.com/i/communities/1837140535728914526
  - Use for model architecture, AI math, inference efficiency, technical diagrams, and deeper K3/model explanations.
- `Artificial Intelligence` - https://x.com/i/communities/1506803450868387846
  - Use for K3, MCP, AI agents, coding agents, model routing, open-source model discussion, and Rebyte agent runtime posts.
- `Build in Public` - https://x.com/i/communities/1493446837214187523
  - Use for founder/product progress, demos, launches, milestones, feedback asks, and lessons from building Rebyte.

Rules:

- Check `https://x.com/m00rphic/communities` before using this strategy, because membership and permissions can change.
- Choose one matching community. Do not blast the same post into every community.
- Before submitting, confirm the community page says `Joined`.
- Verify the composer is posting into the intended community, not the default public timeline.
- Get explicit approval for account, community, and exact text.
- Record the community URL and resulting post URL.

## Strategy: Product Post Animation

For product posts, default to a short animated asset rather than a static
screenshot. Use a static screenshot only when CJ explicitly asks for it or when
the product surface cannot be captured in time.

Requirements:

- Target a short MP4 first. GIF is acceptable only for very small/simple loops.
- Keep the video focused on the product lifecycle, not just one UI frame.
- Show the actual flow the feature enables:
  - user asks or assigns work;
  - Rebyte employee generates the artifact;
  - artifact opens as a live page;
  - user edits it;
  - user saves a revision;
  - user shares it with teammates.
- Use real UI screenshots or product-faithful Kami-style mockups.
- Keep text sparse and native to the product. The animation should explain the
  feature visually.
- Record the media path in the daily note before staging the X post.

For `Sites`, the lifecycle to show is:

1. Ask an employee to generate a page.
2. A beautiful live artifact appears.
3. Open read mode.
4. Edit the page.
5. Save a revision.
6. Share with the team.

## Strategy: Staging Product Videos On X

Use this when staging a product post with an MP4 attachment.

Hard lessons from the Sites post:

- Do not rely on the home timeline inline composer for video posts. It can keep
  stale media state and make upload debugging harder.
- Open a clean composer at `https://x.com/compose/post`.
- Fill text first, then re-snapshot before using refs. X invalidates element refs
  aggressively after editor changes.
- Prefer CSS selector upload for the file input:
  - `agent-browser --cdp 9333 --session <session> upload 'input[type="file"]' <mp4>`
- Before upload, convert Remotion output into an X-compatible MP4. Remotion's
  stripped silent video can be locally playable but still sit in X processing for
  too long, especially when encoded as full-range `yuvj420p` with no audio.
- Preferred command from `my-remotion-demo`:

```bash
npm run build:sites:x
```

- Under the hood, produce a compatibility copy with:

```bash
ffmpeg -y \
  -i my-remotion-demo/out/sites-lifecycle.mp4 \
  -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=44100 \
  -shortest \
  -vf "scale=in_range=pc:out_range=tv,format=yuv420p" \
  -c:v libx264 -pix_fmt yuv420p -profile:v high -level 4.0 \
  -preset veryfast -crf 20 \
  -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -movflags +faststart \
  -c:a aac -b:a 128k \
  my-remotion-demo/out/sites-lifecycle-x-compatible.mp4
```

Ready check:

- Wait until X shows `<filename>: Ready`.
- Confirm the media preview has a play button and the composer has a `Remove
  media` button.
- Do not click `Post`; leave the final publish action to CJ unless he explicitly
  approves exact account, text, and attachment.
- Record the final staged asset path and whether CJ clicked the publish button.

## Strategy: Big-Account Reply Mining

Use this for growth and relationship building.

1. Find credible large accounts in AI, developer tools, open-source models, coding agents, MCP, infra, and founder/build-in-public circles.
2. Open fresh, high-performing posts.
3. Read the top comments and recent replies.
4. Look for a place where Rebyte/CJ can add substance:
   - Clarify an agent or harness tradeoff.
   - Add a concrete implementation detail.
   - Explain context, tools, skills, permissions, APIs, MCP, model routing, or evaluation.
   - Disagree carefully when there is a real technical point.
5. Prefer replying early before the thread becomes too noisy.
6. Avoid shallow replies like "great point" or obvious product plugs.

Recommended account:

- Use `@m00rphic` for opinionated founder/technical replies.
- Use `@rebyteai` only when the reply is useful and product-adjacent without sounding spammy.

## Strategy: Topic Search Discovery

Use search when the following feed is sparse or when Rebyte has a current narrative to push.

Core searches:

- `K3 Codex Claude Code`
- `coding agents open source model`
- `MCP agent harness`
- `agent harness OR MCP filter:follows`

Classify each candidate:

- `reply`: direct, relevant conversation where Rebyte can add substance.
- `quote`: the point deserves a stronger Rebyte-facing take.
- `follow`: the account has repeated signal, not just one lucky post.
- `community`: a top-level post is worth sharing into a matching community.
- `content idea`: useful for future Rebyte posts.
- `ignore`: too generic, too promotional, low relevance, or too risky.

## Strategy: Follow Candidate Review

Do not follow based on one good post unless CJ explicitly wants it.

Check:

- Recent posts have repeated technical or founder signal.
- Audience overlaps with AI engineers, agent builders, founders, developer-tool buyers, or open-source model users.
- The account is not mostly engagement bait, politics, or generic AI hustle content.
- The account can improve future discovery, not just vanity follower count.

## Strategy: Content Ideas

Capture recurring themes for future Rebyte posts:

- The model is not the product; the harness is where work becomes reliable.
- K3 is useful in Rebyte because it plugs into context, permissions, tools, skills, and routing.
- Stateless MCP makes servers easier to scale, but durable agent work still needs state in the harness.
- Codex + K3 and Claude Code + K3 are easy ways to pair a strong coding harness with an open-source model.
- Agents become useful when they can execute skills, call APIs, use context, and respect permissions.

## Daily Note Template

Use this shape in `x-daily/YYYY-MM-DD.md`:

```md
# X Daily Notes - YYYY-MM-DD

## Today

### What We Did

- ...

### Public Actions Sent

- Account:
- Action:
- Target URL:
- Result URL:
- Text:

### Candidates

- Handle:
- URL:
- Recommended action:
- Recommended account:
- Reason:
- Draft:

### Community Opportunities

- Community:
- Fit:
- Draft:
- Status:

### Content Ideas

1. ...

### Open Questions

- ...
```
