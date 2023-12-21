//query for task1: Find all the topics and tasks which are thought in the month of October
db.tasks
  .aggregate([
    {
      $lookup: {
        from: "topics",
        localField: "id",
        foreignField: "id",
        as: "result",
      },
    },
    { $unwind: "$result" },
    { $project: { _id: 0, task: "$taskname", topic: "$result.topic" } },
  ])
  .pretty();

//Answer for task1:
[
  { task: "Simple Calculator", topic: "HTML" },
  { task: "Color gradient", topic: "CSS" },
  { task: "Stop watch", topic: "JS" },
  { task: "Month Calendar", topic: "React" },
  { task: "Shopping cart", topic: "DB" },
];
//query for task2: Find all the company drives which appeared between 15 oct-2020 and 31-oct-2020.
db.company_drives.aggregate([
  {
    $addFields: {
      //converting the date format from string to db acceptable date format.
      convertedDate: {
        $dateFromString: { dateString: "$drive_date", format: "%d-%m-%Y" },
      },
    },
  },
  {
    $match: {
      //checking the conditions.
      convertedDate: {
        $gte: ISODate("2020-10-15T00:00:00.000Z"),
        $lte: ISODate("2020-10-30T23:59:59.999Z"),
      },
    },
  },
  {
    $project: {
      //gathering the required output and converting back to string.
      Company_drive: 1,
      _id: 0,
      driveDate: {
        $dateToString: {
          format: "%Y-%m-%d",
          date: "$convertedDate",
        },
      },
    },
  },
]);
//output:

[
  { Company_drive: "Han Tech", driveDate: "2020-10-15" },
  { Company_drive: "Pan Tech", driveDate: "2020-10-21" },
  { Company_drive: "Woven Tech", driveDate: "2020-10-23" },
];

//query 3: Find all the company drives and students who are appeared for the placement.
db.users.aggregate([
  {
    $lookup: {
      //combining users collection and company_drives with common id key.
      from: "company_drives",
      localField: "id",
      foreignField: "id",
      as: "result",
    },
  },
  {
    $unwind: {
      //converting array into object for easy accessible.
      path: "$result",
    },
  },
  {
    $project: {
      //gathering only the required fields.
      _id: 0,
      companyName: "$result.Company_drive",
      userName: "$username",
    },
  },
]);

//output:
[
  { companyName: "Han Tech", userName: "Arasamannar" },
  { companyName: "Pan Tech", userName: "Arasa" },
  { companyName: "Oven Tech", userName: "Mannar" },
  { companyName: "Joe Tech", userName: "Ak" },
  { companyName: "Woven Tech", userName: "Akmannar" },
];

//query 4: Find the number of problems solved by the user in codekata.

db.users.aggregate([
  {
    $lookup: {
      //combining users and codekatta.
      from: "codekatta",
      localField: "id",
      foreignField: "id",
      as: "result",
    },
  },
  {
    $unwind: {
      path: "$result",
    },
  },
  {
    $project: {
      //getting only the required data.
      _id: 0,
      problemSolved: "$result.problems-solved",
      userName: "$username",
    },
  },
]);

//output:
[
  { problemSolved: "result.problems-solved", userName: "Arasamannar" },
  { problemSolved: "result.problems-solved", userName: "Arasa" },
  { problemSolved: "result.problems-solved", userName: "Mannar" },
  { problemSolved: "result.problems-solved", userName: "Ak" },
  { problemSolved: "result.problems-solved", userName: "Akmannar" },
];

//query 5: Find all the mentors with who has the mentee's count more than 15.

db.mentors.find({ mentee: { $gt: 15 } }, { mentee: 1, name: 1, _id: 0 });
//if the mentee count is greater than 15 result the list with field values of mentee and name.

//output
[
  { name: "Hunter", mentee: 23 },
  { name: "Wood", mentee: 32 },
  { name: "Summer", mentee: 45 },
  { name: "Autumn", mentee: 20 },
];

//query 6: Find the number of users who are absent and task is not submitted  between 15 oct-2020 and 31-oct-2020.

db.users.aggregate([
  {
    $lookup: { //combining users and attendence.
      from: "attendence",
      localField: "id",
      foriegnField: "id",
      as: "result",
    },
  },
  {
    $lookup: { //combining above combined result with tasks.
      from: "tasks",
      localField: "id",
      foriegnField: "id",
      as: "result1",
    },
  },
  {
    $unwind: { //converting first result into an object where operations can be performed.
      path: "$result",
    },
  },
  {
    $unwind: { //converting second result into an object where operations can be performed.
      path: "$result1",
    },
  },
  {
    $project: { //gathering the final required field and value pairs.
      _id: 0,
      absent_date: "$result.absent_date",
      username: "$username",
      taskname: "$result.taskname",
    },
  },
  {
    $match: { //gathering the output where given condition is satisfied.
      absent_date: {
        $ne: "null",
      },
    },
  },
]);

//output
[
  {
    absent_date: "15-10-2020",
    username: "Arasa",
    taskname: "Color gradient",
  },
  {
    absent_date: "17-10-2020",
    username: "Mannar",
    taskname: "Stop watch",
  },
  {
    absent_date: "22-10-2020",
    username: "Ak",
    taskname: "Month Calendar",
  },
];
