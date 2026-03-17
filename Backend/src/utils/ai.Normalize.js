const normalizeArray = (arr, type) => {
  if (!Array.isArray(arr)) return [];

  // case 1: already correct
  if (typeof arr[0] === "object") return arr;

  // case 2: flattened array → reconstruct
  const result = [];

  for (let i = 0; i < arr.length; i += 6) {
    if (type === "qa") {
      result.push({
        question: arr[i + 1],
        intention: arr[i + 3],
        answer: arr[i + 5],
      });
    }

    if (type === "skill") {
            let severity = arr[i + 3];

            // ✅ sanitize severity
            if (!["low", "medium", "high"].includes(severity)) {
                severity = "medium"; // fallback
            }

            result.push({
                skill: arr[i + 1],
                severity
            });
        }

    if (type === "plan") {
      result.push({
        day: arr[i + 1],
        focus: arr[i + 3],
        tasks: [arr[i + 5]],
      });
    }
  }
  console.log("Normalized Result:", result);
  return result;
};

const sanitizeData = (data) => {

    data.skillGaps = data.skillGaps.map(item => ({
        skill: item.skill || "Unknown",
        severity: ["low", "medium", "high"].includes(item.severity)
            ? item.severity
            : "medium"
    }));

    return data;
};

module.exports = { normalizeArray, sanitizeData };