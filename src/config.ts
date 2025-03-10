import { configDotenv } from 'dotenv'
import OpenAI from 'openai'

configDotenv({
  path: './.env',
})

export const CONFIG = {
  TRANSACTION_INPUT_CSV_FILENAME: 'data/transactions-input.csv',
  USER_CSV_FILENAME: 'data/bayard.json',
  REPORT_MARKDOWN_FILENAME: 'data/report.md',
  PRIORITIES_RANKED: [
    'Work',
    'Need',
    'Fitness',
    'Family',
    'Personal Growth',
    'BU Friends',
    'Morgan',
    'Boston Friends',
    'HS Friends',
    'Snowboarding',
    'Savings',
    'Health',
    'Self Indulgence',
    'Credit Card Points',
  ],
  CHAT_CLIENT: new OpenAI({ apiKey: process.env['OPENAI_API_KEY'] }),
}
