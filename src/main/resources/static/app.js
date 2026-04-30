const API = "/polls";

async function loadPolls() {
    try {
        const response = await fetch(API);
        const polls = await response.json();

        const pollsDiv = document.getElementById("polls");
        pollsDiv.innerHTML = "";

        // Empty state
        if (polls.length === 0) {
            pollsDiv.innerHTML = "<p>No polls available. Create one!</p>";
            return;
        }

        polls.forEach(poll => {

            let totalVotes = poll.options.reduce(
                (sum, option) => sum + option.votes,
                0
            );

            let html = `
                <div class="poll-card">
                    <h2>${poll.question}</h2>
            `;

            const voted = localStorage.getItem(`voted_${poll.id}`);

            poll.options.forEach((option, index) => {

                const percentage = totalVotes === 0
                    ? 0
                    : ((option.votes / totalVotes) * 100).toFixed(1);

                // Voting button (disabled after vote)
                html += `
                    <button 
                        onclick="vote(${poll.id}, ${index})"
                        ${voted ? "disabled" : ""}
                    >
                        ${option.text}
                    </button>
                `;

                // Results
                html += `
                    <p>${option.text} - ${option.votes} votes</p>

                    <div class="progress">
                        <div class="progress-bar"
                             style="width:${percentage}%">
                            ${percentage}%
                        </div>
                    </div>
                `;
            });

            if (voted) {
                html += `<p><strong>You already voted</strong></p>`;
            }

            html += `
                <p><strong>Total Votes:</strong> ${totalVotes}</p>

                <button onclick="deletePoll(${poll.id})">
                    Delete Poll
                </button>

                </div>
            `;

            pollsDiv.innerHTML += html;
        });

    } catch (error) {
        alert("Error loading polls");
        console.error(error);
    }
}

// Add option (max 4)
function addOption() {

    const options = document.querySelectorAll(".option");

    if (options.length >= 4) {
        alert("Maximum 4 options allowed");
        return;
    }

    const input = document.createElement("input");

    input.type = "text";
    input.className = "option";
    input.placeholder = `Option ${options.length + 1}`;

    document.getElementById("options-container")
        .appendChild(input);
}

// Create poll
async function createPoll() {

    const question = document.getElementById("question").value;
    const optionInputs = document.querySelectorAll(".option");

    const options = [];

    optionInputs.forEach(input => {
        if (input.value.trim() !== "") {
            options.push({ text: input.value });
        }
    });

    if (question.trim() === "") {
        alert("Question required");
        return;
    }

    if (options.length < 2) {
        alert("Minimum 2 options required");
        return;
    }

    try {
        await fetch(API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                question,
                options
            })
        });

        // Reset form
        document.getElementById("question").value = "";

        document.getElementById("options-container").innerHTML = `
            <input type="text" class="option" placeholder="Option 1">
            <input type="text" class="option" placeholder="Option 2">
        `;

        loadPolls();

    } catch (error) {
        alert("Error creating poll");
        console.error(error);
    }
}

// Vote
async function vote(pollId, optionIndex) {

    if (localStorage.getItem(`voted_${pollId}`)) {
        alert("You already voted!");
        return;
    }

    try {
        await fetch(`${API}/${pollId}/vote`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ optionIndex })
        });

        localStorage.setItem(`voted_${pollId}`, true);

        loadPolls();

    } catch (error) {
        alert("Error voting");
        console.error(error);
    }
}

// Delete poll
async function deletePoll(id) {

    try {
        await fetch(`${API}/${id}`, {
            method: "DELETE"
        });

        localStorage.removeItem(`voted_${id}`);

        loadPolls();

    } catch (error) {
        alert("Error deleting poll");
        console.error(error);
    }
}

// Load on page start
loadPolls();