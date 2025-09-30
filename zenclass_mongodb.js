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
// Topics taught in October 2020
db.topics.find({
  date: {
    $gte: ISODate("2020-10-01"),
    $lte: ISODate("2020-10-31")
  }
});

// Tasks assigned in October 2020
db.tasks.find({
  date: {
    $gte: ISODate("2020-10-01"),
    $lte: ISODate("2020-10-31")
  }
});
db.company_drives.find({
  drive_date: {
    $gte: ISODate("2020-10-15"),
    $lte: ISODate("2020-10-31")
  }
});
db.company_drives.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "students_appeared",
      foreignField: "name",
      as: "appeared_students"
    }
  }
]);
db.codekata.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "user",
      foreignField: "name",
      as: "user_info"
    }
  },
  {
    $project: {
      _id: 0,
      user: 1,
      problems_solved: 1
    }
  }
]);
db.mentors.find({
  mentee_count: { $gt: 15 }
});
db.attendance.aggregate([
  {
    $match: {
      status: "absent",
      date: {
        $gte: ISODate("2020-10-15"),
        $lte: ISODate("2020-10-31")
      }
    }
  },
  {
    $lookup: {
      from: "tasks",
      let: { userName: "$user" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$user", "$$userName"] },
                { $eq: ["$submitted", false] },
                { $gte: ["$date", ISODate("2020-10-15")] },
                { $lte: ["$date", ISODate("2020-10-31")] }
              ]
            }
          }
        }
      ],
      as: "unsubmitted_tasks"
    }
  },
  {
    $match: {
      "unsubmitted_tasks.0": { $exists: true }
    }
  },
  {
    $count: "users_absent_and_not_submitted"
  }
]);