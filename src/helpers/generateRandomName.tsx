const firstNames = [
  "Olivia",
  "Emma",
  "Charlotte",
  "Amelia",
  "Sophia",
  "Isabella",
  "Ava",
  "Mia",
  "Liam",
  "Noah",
  "Oliver",
  "James",
  "Elijah",
  "William",
  "Henry",
  "Lucas",
] as const;

export function generateRandomFirstName() {
  return firstNames[Math.floor(Math.random() * firstNames.length)];
}

const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzales",
  "Wilson",
  "Anderson",
] as const;

export function generateRandomLastName() {
  return lastNames[Math.floor(Math.random() * lastNames.length)];
}