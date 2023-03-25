#!/usr/bin/env node
import inquirer, { QuestionCollection } from "inquirer"
import typeForCommit from "./lib/comitType.js"
import searchList from "inquirer-search-list"

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

inquirer.prompt(questions).then((answers) => {
  console.log(answers)
})
