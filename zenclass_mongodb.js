// Sample users
db.users.insertMany([
  { name: "Gokulakrishna", email: "gokul@example.com", batch: "Zen Batch 1" },
  { name: "Arun", email: "arun@example.com", batch: "Zen Batch 1" }
]);

// Sample topics
db.topics.insertMany([
  { topic: "MongoDB Aggregation", date: ISODate("2020-10-20") },
  { topic: "Node.js Basics", date: ISODate("2020-10-10") }
]);

// Sample tasks
db.tasks.insertMany([
  { task_name: "MongoDB Task", topic: "MongoDB Aggregation", user: "Gokulakrishna", submitted: false, date: ISODate("2020-10-20") }
]);

// Sample attendance
db.attendance.insertMany([
  { user: "Gokulakrishna", date: ISODate("2020-10-20"), status: "absent" }
]);

// Sample codekata
db.codekata.insertMany([
  { user: "Gokulakrishna", problems_solved: 120 }
]);

// Sample company drives
db.company_drives.insertMany([
  { company: "Google", drive_date: ISODate("2020-10-25"), students_appeared: ["Gokulakrishna", "Arun"] }
]);

// Sample mentors
db.mentors.insertMany([
  { name: "Mentor A", mentee_count: 20 },
  { name: "Mentor B", mentee_count: 10 }
]);