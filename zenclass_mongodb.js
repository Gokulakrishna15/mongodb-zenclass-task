// Sample users
db.users.insertMany([
  { _id: ObjectId("507f1f77bcf86cd799439011"), name: "Gokulakrishna", email: "gokul@example.com", batch: "Zen Batch 1" },
  { _id: ObjectId("507f1f77bcf86cd799439012"), name: "Arun", email: "arun@example.com", batch: "Zen Batch 1" }
]);

// Sample topics
db.topics.insertMany([
  { _id: ObjectId("507f1f77bcf86cd799439021"), topic: "MongoDB Aggregation", date: ISODate("2020-10-20") },
  { _id: ObjectId("507f1f77bcf86cd799439022"), topic: "Node.js Basics", date: ISODate("2020-10-10") }
]);

// Sample tasks
db.tasks.insertMany([
  { task_name: "MongoDB Task", topic_id: ObjectId("507f1f77bcf86cd799439021"), user_id: ObjectId("507f1f77bcf86cd799439011"), submitted: false, date: ISODate("2020-10-20") }
]);

// Sample attendance
db.attendance.insertMany([
  { user_id: ObjectId("507f1f77bcf86cd799439011"), date: ISODate("2020-10-20"), status: "absent" }
]);

// Sample codekata
db.codekata.insertMany([
  { user_id: ObjectId("507f1f77bcf86cd799439011"), problems_solved: 120 }
]);

// Sample company drives
db.company_drives.insertMany([
  {
    company: "Google",
    drive_date: ISODate("2020-10-25"),
    student_ids: [
      ObjectId("507f1f77bcf86cd799439011"),
      ObjectId("507f1f77bcf86cd799439012")
    ]
  }
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

// Company drives between 15–31 Oct 2020
db.company_drives.find({
  drive_date: {
    $gte: ISODate("2020-10-15"),
    $lte: ISODate("2020-10-31")
  }
});

// Company drives and students who appeared
db.company_drives.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "student_ids",
      foreignField: "_id",
      as: "appeared_students"
    }
  }
]);

// Number of problems solved by each user
db.codekata.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "user_id",
      foreignField: "_id",
      as: "user_info"
    }
  },
  {
    $project: {
      _id: 0,
      user: { $arrayElemAt: ["$user_info.name", 0] },
      problems_solved: 1
    }
  }
]);

// Mentors with mentee count > 15
db.mentors.find({
  mentee_count: { $gt: 15 }
});

// Users absent and didn’t submit tasks between 15–31 Oct 2020
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
      let: { userId: "$user_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$user_id", "$$userId"] },
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