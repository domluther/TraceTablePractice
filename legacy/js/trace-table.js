// Trace table creation and management module

export class TraceTable {
	constructor() {
		this.expectedTrace = [];
		this.programVariables = [];
	}

	createTraceTable(trace, variables) {
		this.expectedTrace = trace;
		this.programVariables = variables;

		const table = document.getElementById("traceTable");
		const thead = table.querySelector("thead tr");
		const tbody = table.querySelector("tbody");

		// Clear existing content
		thead.innerHTML = "<th>Line Number</th>";
		tbody.innerHTML = "";

		// Add variable columns
		this.programVariables.forEach((varName) => {
			const th = document.createElement("th");
			th.textContent = varName;
			thead.appendChild(th);
		});

		// Add output column
		const outputTh = document.createElement("th");
		outputTh.textContent = "Output";
		thead.appendChild(outputTh);

		// Create rows (enough for the expected trace + a few extra)
		for (let i = 0; i < this.expectedTrace.length + 2; i++) {
			const row = document.createElement("tr");

			// Line number (student enters this)
			const lineCell = document.createElement("td");
			const lineInput = document.createElement("input");
			lineInput.type = "text";
			lineInput.placeholder = "";
			lineCell.appendChild(lineInput);
			row.appendChild(lineCell);

			// Variable cells
			this.programVariables.forEach(() => {
				const cell = document.createElement("td");
				const input = document.createElement("input");
				input.type = "text";
				input.placeholder = "";
				cell.appendChild(input);
				row.appendChild(cell);
			});

			// Output cell
			const outputCell = document.createElement("td");
			const outputInput = document.createElement("input");
			outputInput.type = "text";
			outputInput.placeholder = "";
			outputCell.appendChild(outputInput);
			row.appendChild(outputCell);

			tbody.appendChild(row);
		}
	}

	markAnswer() {
		if (!this.expectedTrace || this.expectedTrace.length === 0) {
			alert("Please generate a program first!");
			return;
		}

		// Clear any previous highlighting
		const allInputs = document.querySelectorAll("#traceTable input");
		allInputs.forEach((input) => {
			input.classList.remove("correct", "incorrect");
		});

		const tbody = document.getElementById("traceTable").querySelector("tbody");
		const rows = tbody.querySelectorAll("tr");

		let correct = 0;
		let total = 0;
		const feedback = [];

		// Create a list of user entries in order with DOM references
		const userEntries = [];
		rows.forEach((row, _) => {
			const cells = row.querySelectorAll("td");
			const lineInput = cells[0].querySelector("input");
			const userLineNumber = lineInput.value.trim();

			if (userLineNumber) {
				const entry = {
					lineNumber: parseInt(userLineNumber),
					variables: {},
					output: "",
					domElements: {
						lineInput,
						variableInputs: {},
						outputInput: null,
					},
				};

				// Get variable values and DOM references
				this.programVariables.forEach((varName, index) => {
					const varInput = cells[index + 1].querySelector("input");
					entry.variables[varName] = varInput.value.trim();
					entry.domElements.variableInputs[varName] = varInput;
				});

				// Get output and DOM reference
				const outputInput = cells[cells.length - 1].querySelector("input");
				entry.output = outputInput.value.trim();
				entry.domElements.outputInput = outputInput;

				userEntries.push(entry);
			}
		});

		// Track variable values throughout execution
		const variableHistory = {};
		this.programVariables.forEach((varName) => {
			variableHistory[varName] = undefined;
		});

		// Process expected trace in order, matching with user entries
		let userIndex = 0;

		this.expectedTrace.forEach((expectedEntry, _) => {
			const lineNum = expectedEntry.lineNumber;

			// Update variable history - handle both regular variables and arrays
			Object.keys(expectedEntry.variables).forEach((varName) => {
				if (expectedEntry.variables[varName] !== undefined) {
					if (Array.isArray(expectedEntry.variables[varName])) {
						// Store the array in history for reference
						variableHistory[varName] = [...expectedEntry.variables[varName]];
					} else {
						// Regular variable
						variableHistory[varName] = expectedEntry.variables[varName];
					}
				}
			});

			// Check if user has an entry for this line
			if (
				userIndex < userEntries.length &&
				userEntries[userIndex].lineNumber === lineNum
			) {
				const userEntry = userEntries[userIndex];

				// Check line number (always correct if we got here)
				total++;
				correct++;
				userEntry.domElements.lineInput.classList.add("correct");

				// Check each variable - handle both regular variables and array elements
				this.programVariables.forEach((varName) => {
					const inputElement = userEntry.domElements.variableInputs[varName];

					// Check if this is an array element (e.g., "colours[0]")
					const arrayMatch = varName.match(/^(\w+)\[(\d+)\]$/);
					let expectedValue, hasChanged;

					if (arrayMatch) {
						// This is an array element
						const arrayName = arrayMatch[1];
						const index = parseInt(arrayMatch[2]);
						const elementName = `${arrayName}[${index}]`;

						// Check if this specific array element changed on this line
						const expectedChangedVariables =
							expectedEntry.changedVariables || {};
						if (Object.hasOwn(expectedChangedVariables, elementName)) {
							hasChanged = true;
							expectedValue = expectedChangedVariables[elementName];
						} else if (
							Object.hasOwn(expectedChangedVariables, arrayName) &&
							Array.isArray(expectedChangedVariables[arrayName])
						) {
							// Fallback: check if the entire array was marked as changed (old format)
							hasChanged = true;
							expectedValue = expectedChangedVariables[arrayName][index];
						} else {
							hasChanged = false;
							// Get current value from variable history for comparison
							if (
								variableHistory[arrayName] &&
								Array.isArray(variableHistory[arrayName])
							) {
								expectedValue = variableHistory[arrayName][index];
							}
						}
					} else {
						// Regular variable
						const expectedChangedVariables =
							expectedEntry.changedVariables || {};
						hasChanged = Object.hasOwn(expectedChangedVariables, varName);
						expectedValue = hasChanged
							? expectedChangedVariables[varName]
							: variableHistory[varName];
					}

					if (hasChanged) {
						// This variable should have a value entered
						total++;
						const userValue = userEntry.variables[varName];

						if (expectedValue === undefined || expectedValue === null) {
							if (userValue === "" || userValue === "undefined") {
								correct++;
								inputElement.classList.add("correct");
							} else {
								feedback.push(
									`Line ${lineNum}, ${varName}: Expected empty/undefined, got "${userValue}"`,
								);
								inputElement.classList.add("incorrect");
							}
						} else {
							if (userValue === expectedValue.toString()) {
								correct++;
								inputElement.classList.add("correct");
							} else {
								feedback.push(
									`Line ${lineNum}, ${varName}: Expected "${expectedValue}", got "${userValue}"`,
								);
								inputElement.classList.add("incorrect");
							}
						}
					} else {
						// This variable didn't change, so user should leave it blank
						total++; // Always count this field in the total
						const userValue = userEntry.variables[varName];
						if (userValue === "") {
							// Correct - user left it blank as expected
							correct++;
							inputElement.classList.add("correct");
						} else {
							// Incorrect - user entered a value when they shouldn't have
							feedback.push(
								`Line ${lineNum}, ${varName}: Variable didn't change on this line, should be blank`,
							);
							inputElement.classList.add("incorrect");
						}
					}
				});

				// Check output
				total++;
				if (userEntry.output === expectedEntry.output) {
					correct++;
					userEntry.domElements.outputInput.classList.add("correct");
				} else {
					feedback.push(
						`Line ${lineNum}, Output: Expected "${expectedEntry.output}", got "${userEntry.output}"`,
					);
					userEntry.domElements.outputInput.classList.add("incorrect");
				}

				userIndex++;
			} else {
				// Missing line
				feedback.push(`Missing line ${lineNum} in your trace table`);
				total += this.programVariables.length + 2; // +1 for line number, +1 for output
			}
		});

		// Check for extra lines
		while (userIndex < userEntries.length) {
			feedback.push(
				`Extra line ${userEntries[userIndex].lineNumber} in your trace table`,
			);
			total += this.programVariables.length + 2;
			userIndex++;
		}

		// Display feedback
		const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
		const feedbackDiv = document.getElementById("feedback");
		feedbackDiv.style.display = "block";

		if (percentage >= 80) {
			feedbackDiv.className = "feedback correct";
			feedbackDiv.innerHTML = `<strong>Well done!</strong> You got ${correct}/${total} correct (${percentage}%)`;
		} else {
			feedbackDiv.className = "feedback incorrect";
			feedbackDiv.innerHTML = `<strong>Not quite right.</strong> You got ${correct}/${total} correct (${percentage}%)`;
		}

		if (feedback.length > 0) {
			const detailsDiv = document.createElement("div");
			detailsDiv.className = "feedback-details";
			detailsDiv.innerHTML =
				"<strong>Details:</strong><br>" +
				feedback
					.map((item) => `<div class="feedback-item incorrect">${item}</div>`)
					.join("");
			feedbackDiv.appendChild(detailsDiv);
		}

		// Return the scoring results
		return {
			correct,
			total,
			percentage,
			feedback: feedback,
		};
	}
}
