async function asyncFunction() {
    return new Promise((resolve) => {
      // Simulate an asynchronous operation (e.g., fetching data)
      setTimeout(() => {
        console.log("Async operation complete");
        resolve();
      }, 2000); // Simulating a delay of 2 seconds
    });
  }
  
  // 1st line
  console.log("First line");
  
  // 2nd line with asynchronous operation
  asyncFunction().then(() => {
    console.log("Second line (after asynchronous operation)");
  });
  
  // 3rd line
  console.log("Third line");