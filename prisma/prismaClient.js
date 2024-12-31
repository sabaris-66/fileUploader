const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.sessionList = async () => {
  const black = await prisma.session.findMany();
  console.log(black);
  return black;
};

exports.findByUsername = async (username) => {
  const user = await prisma.user.findFirst({
    where: {
      username: username,
    },
  });
  return user;
};

exports.pushMember = async (username, fullName, password) => {
  await prisma.user.create({
    data: {
      username: username,
      fullName: fullName,
      password: password,
    },
  });
};

async function main() {
  // await prisma.user.deleteMany();
  // await prisma.user.createMany({
  //   data: [
  //     {
  //       fullName: "sabaris n e",
  //       password: "joy",
  //       username: "sabaris",
  //     },
  //     {
  //       fullName: "admin",
  //       password: "Thanks",
  //       username: "God",
  //     },
  //   ],
  // });
  // const find = await prisma.user.findFirst({
  //   where: {
  //     fullName: "sabaris",
  //   },
  // });
  // const find2 = await findByUsername("God");
  // const find3 = await prisma.user.findMany();
  // const select = await prisma.user.findMany();
  // console.log(select, find, find2, find3);
  // await prisma.user.deleteMany();
  // const select = await prisma.user.findMany();
  // console.log(select);
  // queries
  // await prisma.user.create({
  //   data: {
  //     full_name: "saba saba",
  //     password: "blah blah black sheep",
  //     username: "Sabaris N E",
  //   },
  // });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  });

// export for query usage
