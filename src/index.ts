#!/usr/bin/env node
import inquirer, { QuestionCollection } from "inquirer"
import typeForCommit from "./lib/comitType.js"
import searchList from "inquirer-search-list"
import { $, execa, ExecaError } from "execa"

inquirer.registerPrompt("search-list", searchList)

const questions: QuestionCollection = [
  {
    type: "search-list",
    name: "type",
    message: "What type of commit is this?",
    choices: [...typeForCommit],
  },
  {
    type: "input",
    name: "message",
    message: `Enter your commit message:
    >`,
    transformer(inputMsg, answers, flags) {
      return `${answers.type} ${inputMsg}`
    },
    filter(answers) {
      return answers.toLowerCase()
    },
  },
  {
    type: "confirm",
    name: "confirm",
    message: "confirm commit message:",
    default: true,
  },
]

async function activePrompt() {
  await inquirer.prompt(questions).then(async (answers) => {
    const resultAfterCommit = await execa("git", [
      "commit",
      "-m",
      `${answers.type} ${answers.message}`,
    ])

    if (resultAfterCommit.exitCode === 0) {
      console.log(`
      🎉 Commit success 🎉
      ${resultAfterCommit.stdout}
      `)
    }
  })
}

async function main() {
  try {
    console.clear()
    await $`git diff HEAD --staged --quiet --exit-code`

    console.log("❌ Not staged files :")
  } catch (error) {
    if ((error as ExecaError)?.exitCode === 1) {
      await activePrompt()
    }
  }
}

main()
