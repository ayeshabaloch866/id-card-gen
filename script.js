// ELEMENTS
const nameInput = document.getElementById("name");
const studentIdInput = document.getElementById("studentId");
const programInput = document.getElementById("program");
const sessionInput = document.getElementById("session");
const mobileInput = document.getElementById("mobile");
const validityInput = document.getElementById("validity");
const addressInput = document.getElementById("address");
const universityInput = document.getElementById("university");
const imageUpload = document.getElementById("imageUpload");
const logoUpload = document.getElementById("logoUpload");

const previewNameFront = document.getElementById("previewNameFront");
const previewProgramFront = document.getElementById("previewProgramFront");
const previewSessionFront = document.getElementById("previewSessionFront");
const previewMobileFront = document.getElementById("previewMobileFront");
const previewValidityFront = document.getElementById("previewValidityFront");
const previewAddressFront = document.getElementById("previewAddressFront");
const addressBlock = document.getElementById("addressBlock");
const uniFront = document.getElementById("uniFront");
const uniBack = document.getElementById("uniBack");
const uniLogoFront = document.getElementById("uniLogoFront");
const cardWatermark = document.getElementById("cardWatermark");
const previewImgFront = document.getElementById("previewImgFront");
const barcodeFront = document.getElementById("barcodeFront");
const qrCodeBack = document.getElementById("qrCodeBack");

const cardFlip = document.getElementById("cardFlip");
const generateBtn = document.getElementById("generateBtn");
const printBtn = document.getElementById("printBtn");
const editBtn = document.getElementById("editBtn");
const resetBtn = document.getElementById("resetBtn");
const resultActions = document.getElementById("resultActions");
const cardPreviewContainer = document.getElementById("cardContainer");
const formCard = document.getElementById("formCard");
const mainWrapper = document.getElementById("mainWrapper");

// WIZARD STATE
let currentStep = 1;
const totalSteps = 4;

// MAPPINGS FOR CARD TYPES
const labelMappings = {
    student: {
        idLabel: "Student ID",
        idPlaceholder: "Enter Student ID",
        programLabel: "Program",
        programPlaceholder: "Enter Program (e.g. Computer Science)",
        sessionLabel: "Semester",
        sessionPlaceholder: "Enter Semester (e.g. Fall 2026)",
        badgeText: "Student",
        idPrefix: "ID"
    },
    employee: {
        idLabel: "Employee ID",
        idPlaceholder: "Enter Employee ID",
        programLabel: "Department",
        programPlaceholder: "Enter Department (e.g. Engineering)",
        sessionLabel: "Designation / Job Title",
        sessionPlaceholder: "Enter Designation (e.g. Software Engineer)",
        badgeText: "Employee",
        idPrefix: "EMP ID"
    },
    member: {
        idLabel: "Member ID",
        idPlaceholder: "Enter Member ID",
        programLabel: "Department / Team",
        programPlaceholder: "Enter Department or Team",
        sessionLabel: "Position",
        sessionPlaceholder: "Enter Position (e.g. Coordinator)",
        badgeText: "Member",
        idPrefix: "MEMB ID"
    },
    attendee: {
        idLabel: "Attendee ID",
        idPlaceholder: "Enter Attendee ID",
        programLabel: "Event Name",
        programPlaceholder: "Enter Event Name",
        sessionLabel: "Ticket Type",
        sessionPlaceholder: "Enter Ticket Type (e.g. VIP, Standard)",
        badgeText: "Attendee",
        idPrefix: "ATT ID"
    }
};

const fallbackValues = {
    student: {
        name: "Student Name",
        org: "INSTITUTE NAME",
        program: "Course",
        session: "YYYY"
    },
    employee: {
        name: "Employee Name",
        org: "COMPANY NAME",
        program: "Department",
        session: "Designation"
    },
    member: {
        name: "Member Name",
        org: "ORGANIZATION NAME",
        program: "Department",
        session: "Position"
    },
    attendee: {
        name: "Attendee Name",
        org: "EVENT ORGANIZER",
        program: "Event Name",
        session: "Ticket Type"
    }
};

// INITIALIZE LABELS
function updateCardTypeLabels(cardType) {
    const config = labelMappings[cardType];
    if (!config) return;

    // Form labels and placeholders
    document.getElementById("studentIdLabel").textContent = config.idLabel;
    studentIdInput.placeholder = config.idPlaceholder;
    
    document.getElementById("programLabel").textContent = config.programLabel;
    programInput.placeholder = config.programPlaceholder;
    
    document.getElementById("sessionLabel").textContent = config.sessionLabel;
    sessionInput.placeholder = config.sessionPlaceholder;
    
    // Preview labels
    document.getElementById("cardBadge").textContent = config.badgeText;
    document.getElementById("previewProgramLabel").textContent = config.programLabel;
    document.getElementById("previewSessionLabel").textContent = config.sessionLabel;
}

// SETUP CARD TYPE RADIOS CHANGE LISTENER
const cardTypeRadios = document.querySelectorAll('input[name="cardType"]');
cardTypeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        document.querySelectorAll('.card-type-card').forEach(card => card.classList.remove('active'));
        e.target.closest('.card-type-card').classList.add('active');
        updateCardTypeLabels(e.target.value);

        // Dynamically adjust Address required status for attendees
        if (e.target.value === 'attendee') {
            addressInput.removeAttribute('required');
            addressInput.placeholder = "Enter Address (Optional)";
        } else {
            addressInput.setAttribute('required', 'true');
            addressInput.placeholder = "Enter Full Address";
        }
    });
});

// GET SELECTED CARD TYPE
function getSelectedCardType() {
    const checkedRadio = document.querySelector('input[name="cardType"]:checked');
    return checkedRadio ? checkedRadio.value : 'student';
}

// VALIDATE STEP FIELDS
function validateStep(stepIndex) {
    const currentPanel = document.getElementById(`stepPanel${stepIndex}`);
    const inputs = currentPanel.querySelectorAll("input[required], textarea[required]");
    
    for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        if (!input.value.trim()) {
            input.setCustomValidity("This field is required.");
            input.reportValidity();
            
            // Clear validity warning once user types something
            const clearValidity = () => {
                input.setCustomValidity("");
                input.removeEventListener('input', clearValidity);
            };
            input.addEventListener('input', clearValidity);
            return false;
        } else {
            input.setCustomValidity("");
        }
    }
    return true;
}

// UPDATE WIZARD PROGRESS BAR & INDICATORS
function updateWizardProgress() {
    // Progress Bar Fill
    const fillPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;
    document.getElementById("progressBarFill").style.width = `${fillPercent}%`;

    // Indicators
    const indicators = document.querySelectorAll(".step-indicator");
    indicators.forEach((indicator, index) => {
        const stepNum = index + 1;
        indicator.classList.remove("active", "completed");
        if (stepNum === currentStep) {
            indicator.classList.add("active");
        } else if (stepNum < currentStep) {
            indicator.classList.add("completed");
        }
    });

    // Panel Visibility
    for (let i = 1; i <= totalSteps; i++) {
        const panel = document.getElementById(`stepPanel${i}`);
        if (i === currentStep) {
            panel.classList.add("active");
        } else {
            panel.classList.remove("active");
        }
    }

    // Step Header Title
    const stepTitles = [
        "Select Card Type & Name",
        "Enter Organization Details",
        "Enter Contact & Validity",
        "Upload Logo & Profile Photo"
    ];
    document.getElementById("stepText").textContent = `Step ${currentStep} of ${totalSteps}: ${stepTitles[currentStep - 1]}`;

    // Navigation Buttons Toggling
    const backBtn = document.getElementById("backBtn");
    const nextBtn = document.getElementById("nextBtn");

    if (currentStep === 1) {
        backBtn.style.display = "none";
    } else {
        backBtn.style.display = "block";
    }

    if (currentStep === totalSteps) {
        nextBtn.style.display = "none";
        generateBtn.style.display = "block";
    } else {
        nextBtn.style.display = "block";
        generateBtn.style.display = "none";
    }
}

// NAVIGATION HANDLERS
document.getElementById("nextBtn").addEventListener("click", () => {
    if (validateStep(currentStep)) {
        if (currentStep < totalSteps) {
            currentStep++;
            updateWizardProgress();
        }
    }
});

document.getElementById("backBtn").addEventListener("click", () => {
    if (currentStep > 1) {
        currentStep--;
        updateWizardProgress();
    }
});

// SETUP FILE DROP ZONES & PREVIEWS
const setupDropZone = (dropZoneId, fileInputId, previewWrapperId, previewImgId, removeBtnId) => {
    const dropZone = document.getElementById(dropZoneId);
    const fileInput = document.getElementById(fileInputId);
    const previewWrapper = document.getElementById(previewWrapperId);
    const previewImg = document.getElementById(previewImgId);
    const removeBtn = document.getElementById(removeBtnId);

    // Prevent default behaviors for drag events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, e => e.preventDefault(), false);
    });

    // Style highlighting for dragging over
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.add('highlight'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.remove('highlight'), false);
    });

    // Drop handler
    dropZone.addEventListener('drop', e => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length) {
            fileInput.files = files;
            updateFilePreview(fileInput, previewWrapper, previewImg, dropZone);
        }
    }, false);

    // File input change handler
    fileInput.addEventListener('change', () => {
        updateFilePreview(fileInput, previewWrapper, previewImg, dropZone);
    });

    // Remove file handler
    removeBtn.addEventListener('click', e => {
        e.stopPropagation();
        fileInput.value = '';
        previewWrapper.style.display = 'none';
        previewImg.src = '';
        dropZone.style.display = 'block';
    });
};

const updateFilePreview = (input, wrapper, img, dropZone) => {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = e => {
            img.src = e.target.result;
            wrapper.style.display = 'flex';
            dropZone.style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
};

setupDropZone('logoDropZone', 'logoUpload', 'logoPreviewWrapper', 'logoPreviewImg', 'removeLogoBtn');
setupDropZone('photoDropZone', 'imageUpload', 'photoPreviewWrapper', 'photoPreviewImg', 'removePhotoBtn');

// Logo removal clears watermark too
document.getElementById("removeLogoBtn").addEventListener("click", () => {
    cardWatermark.src = '';
});

// GENERATE CARD
generateBtn.addEventListener("click", () => {
    if (!validateStep(currentStep)) return;

    const cardType = getSelectedCardType();
    const config = labelMappings[cardType];
    const fallback = fallbackValues[cardType];

    // Card Front Details
    previewNameFront.textContent = nameInput.value || fallback.name;
    previewProgramFront.textContent = programInput.value || fallback.program;
    previewSessionFront.textContent = sessionInput.value || fallback.session;
    previewMobileFront.textContent = mobileInput.value || "01XXXXXXXXX";
    previewValidityFront.textContent = validityInput.value || "DD-MM-YYYY";
    uniFront.textContent = uniBack.textContent = universityInput.value || fallback.org;
    barcodeFront.textContent = `${config.idPrefix}: ${studentIdInput.value || "XXXXXXXXXX"}`;

    // Address
    const addressVal = addressInput.value.trim();
    if (addressVal) {
        previewAddressFront.textContent = addressVal;
        addressBlock.style.display = "block";
    } else {
        previewAddressFront.textContent = "";
        addressBlock.style.display = "none";
    }

    // Profile photo upload or fallback
    const file = imageUpload.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => previewImgFront.src = reader.result;
        reader.readAsDataURL(file);
    } else {
        previewImgFront.src = "https://api.dicebear.com/7.x/personas/svg";
    }

    // Logo upload or fallback (updates logo & watermark background)
    const logoFile = logoUpload.files[0];
    if (logoFile) {
        const reader = new FileReader();
        reader.onload = () => {
            uniLogoFront.src = reader.result;
            cardWatermark.src = reader.result;
        };
        reader.readAsDataURL(logoFile);
    } else {
        uniLogoFront.src = "https://via.placeholder.com/50";
        cardWatermark.src = "";
    }

    // QR Code generation
    const qrData = `Name: ${previewNameFront.textContent}\nID: ${studentIdInput.value}\nOrg: ${uniFront.textContent}\nMobile: ${previewMobileFront.textContent}`;
    qrCodeBack.src = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(qrData)}`;

    // Show result view (hide form, center card container)
    formCard.style.display = "none";
    mainWrapper.classList.add("result-view-mode");

    // Show card layout with animations
    cardPreviewContainer.style.display = "flex";
    cardFlip.classList.remove("flipped");
    setTimeout(() => cardFlip.classList.add("show"), 50);

    // Show action buttons
    resultActions.style.display = "flex";
});

// FLIP CARD (click triggers toggle)
cardFlip.addEventListener("click", () => {
    if (cardFlip.classList.contains("show")) {
        cardFlip.classList.toggle("flipped");
    }
});

// PRINT ID CARD
printBtn.addEventListener("click", () => window.print());

// EDIT DETAILS BACK TO FORM
editBtn.addEventListener("click", () => {
    // Show form, return to step 4
    formCard.style.display = "block";
    mainWrapper.classList.remove("result-view-mode");
    currentStep = 4;
    updateWizardProgress();

    // Hide result controls, hide card container
    resultActions.style.display = "none";
    cardPreviewContainer.style.display = "none";
    cardFlip.classList.remove("show");
});

// RESET FORM & START NEW
resetBtn.addEventListener("click", () => {
    // Reset all form inputs
    document.getElementById("wizardForm").reset();

    // Reset file preview wrappers
    document.getElementById("logoPreviewWrapper").style.display = 'none';
    document.getElementById("logoPreviewImg").src = '';
    document.getElementById("logoDropZone").style.display = 'block';
    
    document.getElementById("photoPreviewWrapper").style.display = 'none';
    document.getElementById("photoPreviewImg").src = '';
    document.getElementById("photoDropZone").style.display = 'block';

    // Reset watermark
    cardWatermark.src = '';

    // Reset radio visual states
    document.querySelectorAll('.card-type-card').forEach(card => {
        const radio = card.querySelector('input');
        if (radio && radio.checked) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });

    // Reset address required state
    addressInput.setAttribute('required', 'true');
    addressInput.placeholder = "Enter Full Address";

    // Show form, reset to step 1
    formCard.style.display = "block";
    mainWrapper.classList.remove("result-view-mode");
    currentStep = 1;
    updateWizardProgress();

    // Hide result controls, hide card container
    resultActions.style.display = "none";
    cardPreviewContainer.style.display = "none";
    cardFlip.classList.remove("show");
});

// RUN INITIAL LABELS SETTING
updateCardTypeLabels('student');
