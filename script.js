document.addEventListener("DOMContentLoaded", () => {

    setupComicForm();

    setupCharacterCounter();

    setupFeedbackForm();

    setupAnimations();

});


/* =====================================================
   Comic Generation Form
   ===================================================== */

function setupComicForm() {

    const form =
        document.getElementById("comic-form");

    if (!form) {
        return;
    }

    form.addEventListener("submit", (event) => {

        const creator =
            document.getElementById("creator_name");

        const prompt =
            document.getElementById("story_prompt");

        const button =
            document.getElementById("generate-button");

        const loading =
            document.getElementById("loading");


        if (!creator.value.trim()) {

            event.preventDefault();

            alert("Please enter your name.");

            creator.focus();

            return;
        }


        if (prompt.value.trim().length < 10) {

            event.preventDefault();

            alert(
                "Please enter at least 10 characters for your story."
            );

            prompt.focus();

            return;
        }


        button.disabled = true;

        button.innerHTML =
            "✦ Creating Comic...";


        if (loading) {

            loading.hidden = false;

        }

    });

}


/* =====================================================
   Character Counter
   ===================================================== */

function setupCharacterCounter() {

    const textarea =
        document.getElementById("story_prompt");

    const counter =
        document.getElementById("prompt-count");


    if (!textarea || !counter) {
        return;
    }


    function updateCounter() {

        counter.textContent =
            textarea.value.length;

    }


    textarea.addEventListener(
        "input",
        updateCounter
    );


    updateCounter();

}


/* =====================================================
   Feedback
   ===================================================== */

function setupFeedbackForm() {

    const form =
        document.getElementById(
            "feedback-form"
        );

    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const comicId =
                form.dataset.comicId;

            const feedback =
                document.getElementById(
                    "feedback"
                ).value.trim();

            const status =
                document.getElementById(
                    "feedback-status"
                );

            const button =
                form.querySelector(
                    "button[type='submit']"
                );


            if (feedback.length < 3) {

                status.textContent =
                    "Please enter more feedback.";

                status.style.color =
                    "#dc2626";

                return;

            }


            button.disabled = true;

            button.textContent =
                "Improving...";


            status.textContent =
                "ComicCraft is improving your comic...";

            status.style.color =
                "#7c3aed";


            try {

                const response =
                    await fetch(
                        `/api/improve/${comicId}`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                feedback: feedback
                            })
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.detail ||
                        "Unable to improve comic."
                    );

                }


                status.textContent =
                    "Comic improved! Reloading...";

                status.style.color =
                    "#16a34a";


                setTimeout(() => {

                    window.location.href =
                        `/comic/${comicId}`;

                }, 700);


            } catch (error) {

                status.textContent =
                    error.message;

                status.style.color =
                    "#dc2626";

                button.disabled = false;

                button.textContent =
                    "Improve Comic";

            }

        }
    );

}


/* =====================================================
   Simple Reveal Animation
   ===================================================== */

function setupAnimations() {

    const elements =
        document.querySelectorAll(
            ".feature, .history-card, .comic-panel, .character-card"
        );


    elements.forEach(
        (element, index) => {

            element.style.opacity = "0";

            element.style.transform =
                "translateY(12px)";


            setTimeout(() => {

                element.style.transition =
                    "opacity 0.45s ease, transform 0.45s ease";

                element.style.opacity = "1";

                element.style.transform =
                    "translateY(0)";

            }, index * 50);

        }
    );

}
