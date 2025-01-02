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

exports.findByFolderName = async (folderName) => {
  const folder = await prisma.folder.findFirst({
    where: {
      folderName: folderName,
    },
  });
  return folder;
};

exports.createFolder = async (folderName) => {
  await prisma.folder.create({
    data: {
      folderName: folderName,
    },
  });
};

exports.getFolders = async () => {
  const folders = await prisma.folder.findMany();
  return folders;
};

exports.updateFolder = async (folderName, updateName) => {
  await prisma.folder.update({
    where: {
      folderName: folderName,
    },
    data: {
      folderName: updateName,
    },
  });
};

exports.deleteFolder = async (folderName) => {
  await prisma.folder.delete({
    where: {
      folderName: folderName,
    },
  });
};

exports.addFileInfo = async (fileInfo, folder) => {
  if (folder) {
    await prisma.file.create({
      data: {
        ...fileInfo,
        folder: folder,
      },
    });
  } else {
    await prisma.file.create({
      data: fileInfo,
    });
  }
};

exports.getFiles = async (folder) => {
  if (folder) {
    const files = await prisma.file.findMany({
      where: {
        folder: folder,
      },
    });
    return files;
  } else {
    const files = await prisma.file.findMany({
      where: {
        folder: null,
      },
    });
    return files;
  }
};

async function main() {
  const find = await prisma.file.findMany();
  console.log(find[0]);
  // await prisma.file.deleteMany();
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
