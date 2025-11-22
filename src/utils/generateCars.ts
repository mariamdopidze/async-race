// src/utils/generateCars.ts
const brands = [
  "Tesla", "BMW", "Mercedes", "Audi", "Porsche", "Ferrari", "Lamborghini",
  "Toyota", "Honda", "Ford", "Chevrolet", "Nissan", "Volkswagen", "Hyundai"
];

const models = [
  "Model S", "X5", "S-Class", "A8", "911", "488", "Huracan", "Mustang",
  "Camry", "Civic", "F-150", "GT-R", "Golf", "Sonata", "Supra", "911 Turbo"
];

const getRandom = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

export const generate100Cars = async () => {
  const cars = Array.from({ length: 100 }, () => ({
    name: `${getRandom(brands)} ${getRandom(models)}`,
    color: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`,
  }));

  for (const car of cars) {
    await fetch("http://127.0.0.1:3000/garage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(car),
    });
  }
};