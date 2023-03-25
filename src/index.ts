#!/usr/bin/env node
import inquirer, { QuestionCollection } from "inquirer"
import typeForCommit from "./lib/comitType.js"
import searchList from "inquirer-search-list"
import { $, execa } from "execa"
import { COMMAND } from "./lib/command.js"

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
      return `${answers.type} : ${inputMsg}`
    },
  },
  {
    type: "confirm",
    name: "confirm",
    message: "confirm commit message:",
  },
]

async function activePrompt() {
  await inquirer.prompt(questions).then(async (answers) => {
    const resultAfterCommit = await execa("git", [
      "commit",
      "-m",
      `${answers.type} ${answers.message}`,
    ])

    console.log("🎉 Commit success 🎉")
  })
}

async function main() {
  try {
    console.clear()
    const res = await $`git diff HEAD --staged --quiet --exit-code`
    if (res.exitCode === 0) {
      await $`git add .`
      await activePrompt()
    }
  } catch (error) {
    await activePrompt()
  }
}

main()
