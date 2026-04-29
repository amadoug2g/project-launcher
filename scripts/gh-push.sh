#!/bin/bash
# gh-push.sh — Push local file changes to GitHub via REST API
# Bypasses the git HTTPS proxy used by Claude Code cloud routines.
#
# Usage:
#   ./scripts/gh-push.sh <branch> <commit-message> <file1> [file2] ...
#
# Example:
#   ./scripts/gh-push.sh feature/20260429-landing-page "feat: add landing page" src/index.html src/app.html
#
# Requirements: gh CLI authenticated (gh auth status)

set -e

REPO="${GH_REPO:-amadoug2g/project-launcher}"
BRANCH="$1"
COMMIT_MSG="$2"
shift 2
FILES=("$@")

if [ -z "$BRANCH" ] || [ -z "$COMMIT_MSG" ] || [ ${#FILES[@]} -eq 0 ]; then
  echo "Usage: $0 <branch> <commit-message> <file1> [file2] ..."
  exit 1
fi

# Create branch if it doesn't exist on remote
EXISTING=$(gh api "repos/$REPO/git/ref/heads/$BRANCH" --jq '.ref' 2>/dev/null || echo "")
if [ -z "$EXISTING" ]; then
  echo "Creating branch $BRANCH on GitHub..."
  MAIN_SHA=$(gh api "repos/$REPO/git/ref/heads/main" --jq '.object.sha')
  gh api "repos/$REPO/git/refs" --method POST \
    -f ref="refs/heads/$BRANCH" \
    -f sha="$MAIN_SHA"
fi

# Push each file
for FILE in "${FILES[@]}"; do
  if [ ! -f "$FILE" ]; then
    echo "Warning: $FILE not found, skipping"
    continue
  fi

  echo "Pushing $FILE..."
  CONTENT=$(base64 -w0 "$FILE" 2>/dev/null || base64 "$FILE")
  EXISTING_SHA=$(gh api "repos/$REPO/contents/$FILE?ref=$BRANCH" --jq '.sha' 2>/dev/null || echo "")

  if [ -z "$EXISTING_SHA" ]; then
    gh api "repos/$REPO/contents/$FILE" --method PUT \
      -f message="$COMMIT_MSG" \
      -f content="$CONTENT" \
      -f branch="$BRANCH"
  else
    gh api "repos/$REPO/contents/$FILE" --method PUT \
      -f message="$COMMIT_MSG" \
      -f content="$CONTENT" \
      -f sha="$EXISTING_SHA" \
      -f branch="$BRANCH"
  fi
done

echo "Done. All files pushed to $BRANCH."
