import { User, Employee } from "../models/User.js";
import validator from "email-validator";
import readline from "readline";
import bcrypt from "bcryptjs";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const userData = {};

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function askForData() {
  console.log("Creando usuario administrador");

  while (!userData.firstName) {
    userData.firstName = await askQuestion("Ingresa tu nombre/s: ");
  }

  while (!userData.lastName) {
    userData.lastName = await askQuestion("Ingresa tus apellidos: ");
  }

  while (!userData.email || !validator.validate(userData.email)) {
    if (userData.email) {
      console.log("Ingresa un email válido.");
    }
    userData.email = await askQuestion("Ingresa tu email: ");
  }

  while (!userData.password || userData.password.length <= 6) {
    if (userData.password) {
      console.log("Ingresa una contraseña valida.");
    }
    userData.password = await askQuestion(
      "Ingresa tu contraseña (debe ser mayor a 6 caracteres): "
    );
  }

  const passwordHash = await bcrypt.hash(userData.password, 10);

  const [user, created] = await User.findOrCreate({
    where: { ci: "00000001" },
    defaults: {
      firstName: userData.firstName,
      lastName: userData.lastName,
      ci: "00000001",
      email: userData.email,
      password: passwordHash,
    },
  });

  const [employee, createdEmployee] = await Employee.findOrCreate({
    where: { userId: user.id },
    defaults: {
      staff: true,
      admin: true,
      userId: user.id,
    },
  });

  if (!created) console.log("El usuario ya ha sido creado anteriormente");

  console.log("Datos de usuario");
  console.log("Nombre/s:", user.firstName);
  console.log("Apellidos:", user.lastName);
  console.log("Email:", user.email);

  rl.close();
}

askForData();
