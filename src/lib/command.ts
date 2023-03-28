export const COMMAND = {
  checkStageChange: "git diff HEAD --staged --quiet --exit-code",
  status: `git status --short | wc -l`,
}
