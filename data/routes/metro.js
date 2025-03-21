const now = new Date();

// Get date components
const year = now.getFullYear();
const month = now.getMonth() + 1; // Months are 0-indexed (0 = January)
const day = now.getDate();

// Get time components
const hours = now.getHours();
const minutes = now.getMinutes();
const seconds = now.getSeconds();

// Format date and time
const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
  .toString()
  .padStart(2, "0")}`;
const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
  .toString()
  .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

console.log(`Date: ${formattedDate}`);
console.log(`Time: ${formattedTime}`);
