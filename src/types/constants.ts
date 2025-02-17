import * as t from 'io-ts'

const CategoryTypes = {
  Savings: null,
  Entertainment: null,
  Fitness: null,
  MBTA: null,
  Food: null,
  Drinks: null,
  Grocery: null,
  Travel: null,
  Books: null,
  Rent: null,
  'Auto Insurance': null,
  Health: null,
  Coffee: null,
  Gas: null,
  'Credit Card Points': null,
  ChatGPT: null,
  Salary: null,
  Snowboarding: null,
  Gift: null,
  Investment: null,
  Family: null,
  Refund: null,
}

export const CategoryTypeCodec = t.keyof(CategoryTypes)

export const RecurrenceType = t.union([
  t.literal('Daily'),
  t.literal('Weekly'),
  t.literal('Bi-Weekly'),
  t.literal('Monthly'),
  t.literal('Yearly'),
  t.literal(''),
])
