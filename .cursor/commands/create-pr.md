# Create Pull Request Command

When the user requests to create a Pull Request, follow these steps systematically:

## Step 1: Analyze Codebase Changes

Run the following command to analyze what has changed:
```bash
git diff main...HEAD
```

If the target branch is different from `main`, adjust the command accordingly (e.g., `git diff develop...HEAD`).

Analyze the diff output to understand:
- Which files were modified, added, or deleted
- The nature of the changes (features, bug fixes, refactoring, etc.)
- The scope and impact of the changes

## Step 2: Draft PR Title

Create a PR title using **Conventional Commits** format:

**Format:** `<type>: <short description>`

**Common Types:**
- `feat:` - A new feature
- `fix:` - A bug fix
- `docs:` - Documentation only changes
- `style:` - Code style changes (formatting, missing semicolons, etc.)
- `refactor:` - Code refactoring without feature changes or bug fixes
- `perf:` - Performance improvements
- `test:` - Adding or updating tests
- `chore:` - Changes to build process or auxiliary tools
- `ci:` - Changes to CI configuration files and scripts

**Examples:**
- `feat: add draft mode for blog posts`
- `fix: resolve blog post filtering in production`
- `refactor: improve blog card component structure`

The title should be:
- Concise (50-72 characters ideal)
- Descriptive of the main change
- Use imperative mood ("add" not "added" or "adds")

## Step 3: Draft PR Description

Create a comprehensive PR description with the following sections:

### Summary
Provide a high-level explanation of **why** this change was made. Explain the problem it solves, the feature it adds, or the improvement it brings. This should be 2-4 sentences that give context to reviewers.

### Key Changes
Provide a bulleted list of technical changes. Be specific about:
- Files modified and what changed in each
- New features or functionality added
- Bug fixes implemented
- Configuration or schema updates
- Dependencies added or updated

Format:
```markdown
- Updated `src/content/config.ts` to add `draft` field to blog schema
- Modified `src/pages/blog/index.astro` to filter draft posts in production
- Added visual draft badge indicator in blog list view
```

### Test Plan
Provide clear instructions on how to verify the changes work correctly. Include:
- Commands to run (e.g., `npm run dev`, `npm test`)
- Manual testing steps
- What to check or verify
- Expected behavior vs actual behavior

Format:
```markdown
1. Run `npm run dev` to start the development server
2. Navigate to `/blog` and verify draft posts are visible with badge
3. Check that draft posts are filtered out in production build
4. Verify the draft badge appears on draft posts in dev mode
```

## Step 4: Generate GitHub CLI Command

Output the exact terminal command to create the PR using GitHub CLI:

**Format:**
```bash
gh pr create --title "<PR_TITLE>" --body "<PR_DESCRIPTION>"
```

**Important:**
- Escape any quotes or special characters in the title and body
- Use `--base main` (or appropriate base branch) if needed
- The body should be a single string with escaped newlines (`\n`) or use a here-doc

**Example:**
```bash
gh pr create --title "feat: add draft mode for blog posts" --body "Summary:\n\nThis PR adds a draft mode feature to allow blog posts to be hidden from production while remaining visible in development.\n\nKey Changes:\n\n- Updated blog schema to include optional draft field\n- Added filtering logic to exclude drafts in production\n- Added visual draft badge indicator\n\nTest Plan:\n\n1. Run npm run dev\n2. Verify draft posts show with badge\n3. Build for production and verify drafts are hidden"
```

**Alternative (using here-doc for multi-line body):**
```bash
gh pr create --title "feat: add draft mode for blog posts" --body "$(cat <<'EOF'
Summary:
[Your summary here]

Key Changes:
- [Change 1]
- [Change 2]

Test Plan:
1. [Step 1]
2. [Step 2]
EOF
)"
```

## Output Format

When generating the PR, present it in this order:

1. **PR Title:** Show the formatted title
2. **PR Description:** Show the full description with all sections
3. **GitHub CLI Command:** Show the exact command to run

**Action:** Immediately execute the GitHub CLI command to create the PR without asking for confirmation. The PR should be created automatically.

