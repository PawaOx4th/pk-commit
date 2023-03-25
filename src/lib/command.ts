export const COMMAND = {
  // status: `git status --short`,
  checkStageChange: "git diff HEAD --staged --quiet --exit-code",
  status: `git status --short | wc -l`,
}
