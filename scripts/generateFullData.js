const fs = require('fs');
const path = require('path');

const raw = fs.readFileSync('YET THE BUTTERFLIES FLUTTER AWAY.txt', 'utf8');
const allLines = raw.split(/\r?\n/);

console.log('Generating complete story data, state machine, and asset map...');
fs.mkdirSync('src/data', { recursive: true });
fs.mkdirSync('src/logic', { recursive: true });

// Scene configurations with line ranges (1-indexed based on file line numbers)
const sceneDefs = [
  {
    id: "prologue",
    title: "PROLOGUE: A WHISPER IN THE DARK",
    background: "rooftop_night",
    start: 5,
    end: 34,
    choiceId: "choice_1",
    choicePrompt: "CHOICE 1: HOW WILL JOAN RESPOND?",
    options: [
      {
        key: "A",
        text: "Tell Aflania everything. Go to Scene 1A.",
        targetScene: "scene_1a",
        paranoiaDelta: -5,
        description: "Joan is completely open with Aflania, seeking clarity together."
      },
      {
        key: "B",
        text: "Dismiss the conversation and spend the evening with Aflania. Go to Scene 1B.",
        targetScene: "scene_1b",
        paranoiaDelta: 5,
        description: "Joan bottles up his worries, attempting to preserve peace silently."
      },
      {
        key: "C",
        text: "Ask Aflania whether she has noticed anything unusual about Laqquo. Go to Scene 1C.",
        targetScene: "scene_1c",
        paranoiaDelta: 10,
        description: "Joan probes cautiously, inadvertently allowing suspicion to touch his wife."
      }
    ]
  },
  {
    id: "scene_1a",
    title: "SCENE 1A: THE FIRST CONVERSATION",
    background: "bedroom",
    start: 35,
    end: 56,
    choiceId: "choice_2a",
    choicePrompt: "CHOICE 2A: WHAT SHOULD JOAN DO NEXT?",
    options: [
      {
        key: "A",
        text: "Speak to Cassian directly. Go to Scene 2A.",
        targetScene: "scene_2a",
        paranoiaDelta: 0,
        description: "Joan seeks first-hand facts from the young officer directly."
      },
      {
        key: "B",
        text: "Ask Emilia whether Laqquo has been behaving strangely. Go to Scene 2B.",
        targetScene: "scene_2b",
        paranoiaDelta: -5,
        description: "Joan checks the credibility of his accuser via Laqquo's wife."
      },
      {
        key: "C",
        text: "Confront Laqquo about his repeated insinuations. Go to Scene 2C.",
        targetScene: "scene_2c",
        paranoiaDelta: 5,
        description: "Joan pushes back against Laqquo's subtle manipulation."
      }
    ]
  },
  {
    id: "scene_1b",
    title: "SCENE 1B: THE EVENING OF PEACE",
    background: "bedroom",
    start: 57,
    end: 76,
    choiceId: "choice_2b",
    choicePrompt: "CHOICE 2B: HOW WILL JOAN PROCEED?",
    options: [
      {
        key: "A",
        text: "Observe Cassian and Aflania without drawing conclusions. Go to Scene 2A.",
        targetScene: "scene_2a",
        paranoiaDelta: 10,
        description: "Joan begins watching them, trying to verify Laqquo's words."
      },
      {
        key: "B",
        text: "Confront Laqquo about his repeated insinuations. Go to Scene 2C.",
        targetScene: "scene_2c",
        paranoiaDelta: 5,
        description: "Joan demands clarity from his subordinate."
      },
      {
        key: "C",
        text: "Discuss the situation openly with Aflania. Return to Scene 1A and continue with Scene 2B.",
        targetScene: "scene_1a",
        returnTo2B: true,
        paranoiaDelta: -10,
        description: "Joan breaks the silence and confides in Aflania, then continues investigation with Emilia."
      }
    ]
  },
  {
    id: "scene_1c",
    title: "SCENE 1C: THE QUESTION OF LAQQUO",
    background: "bedroom",
    start: 77,
    end: 94,
    choiceId: "choice_2c",
    choicePrompt: "CHOICE 2C: THE NEXT STEP",
    options: [
      {
        key: "A",
        text: "Ask Emilia to help discover what Laqquo is planning. Go to Scene 2B.",
        targetScene: "scene_2b",
        paranoiaDelta: -5,
        description: "Joan requests Emilia's aid to investigate Laqquo's motive."
      },
      {
        key: "B",
        text: "Confront Laqquo openly and demand an explanation. Go to Scene 2C.",
        targetScene: "scene_2c",
        paranoiaDelta: 5,
        description: "Joan confronts Laqquo face to face."
      },
      {
        key: "C",
        text: "Bring Aflania, Cassian, and Laqquo together to discuss the accusations. Go to Scene 3.",
        targetScene: "scene_3",
        paranoiaDelta: 10,
        description: "Joan forces an open confrontation among all three."
      }
    ]
  },
  {
    id: "scene_2a",
    title: "SCENE 2A: CASSIAN'S ANSWER",
    background: "courtyard_day",
    start: 95,
    end: 111,
    choiceId: "choice_3a",
    choicePrompt: "CHOICE 3A: WHAT DOES JOAN DO WITH THE BROOCH?",
    options: [
      {
        key: "A",
        text: "Return it to Aflania and ask how she lost it. Go to Scene 3B.",
        targetScene: "scene_3b",
        paranoiaDelta: -5,
        description: "Joan brings the keepsake back to his wife with honest concern."
      },
      {
        key: "B",
        text: "Ask the servant who else had access to the corridor. Go to Scene 3C.",
        targetScene: "scene_3c",
        paranoiaDelta: 0,
        description: "Joan questions the logistics of how the brooch arrived in the corridor."
      },
      {
        key: "C",
        text: "Show the brooch to Laqquo and observe his reaction. Go to Scene 3D.",
        targetScene: "scene_3d",
        paranoiaDelta: 10,
        description: "Joan tests Laqquo to see how he responds to the physical item."
      }
    ]
  },
  {
    id: "scene_2b",
    title: "SCENE 2B: EMILIA'S SECRET",
    background: "corridor",
    start: 112,
    end: 122,
    choiceId: "choice_3b",
    choicePrompt: "CHOICE 3B: HOW WILL JOAN USE THIS INFORMATION?",
    options: [
      {
        key: "A",
        text: "Confront Laqquo with Emilia's testimony. Go to Scene 4A.",
        targetScene: "scene_4a",
        paranoiaDelta: -10,
        description: "Armed with Emilia's confession, Joan corners Laqquo with undeniable proof."
      },
      {
        key: "B",
        text: "Speak to Aflania and explain everything he has learned. Go to Scene 3B.",
        targetScene: "scene_3b",
        paranoiaDelta: -10,
        description: "Joan brings the truth back to Aflania to reassure her and clear the air."
      },
      {
        key: "C",
        text: "Investigate the brooch's movements before confronting anyone. Go to Scene 3C.",
        targetScene: "scene_3c",
        paranoiaDelta: 0,
        description: "Joan verifies the physical chain of events through the servants."
      }
    ]
  },
  {
    id: "scene_2c",
    title: "SCENE 2C: THE LIEUTENANT'S WARNING",
    background: "main_hall",
    start: 123,
    end: 138,
    choiceId: "choice_3c",
    choicePrompt: "CHOICE 3C: THE CONFRONTATION",
    options: [
      {
        key: "A",
        text: "Summon Aflania and Cassian to establish the facts together. Go to Scene 3.",
        targetScene: "scene_3",
        paranoiaDelta: 5,
        description: "Joan summons everyone to the main hall."
      },
      {
        key: "B",
        text: "Ask Emilia to reveal everything she knows about Laqquo. Go to Scene 2B.",
        targetScene: "scene_2b",
        paranoiaDelta: -5,
        description: "Joan seeks Emilia's independent perspective."
      },
      {
        key: "C",
        text: "Give Laqquo one final opportunity to produce genuine evidence. Go to Scene 4A.",
        targetScene: "scene_4a",
        paranoiaDelta: -5,
        description: "Joan challenges Laqquo to prove his claims under formal scrutiny."
      }
    ]
  },
  {
    id: "scene_3",
    title: "SCENE 3: THREE PEOPLE, ONE ACCUSATION",
    background: "main_hall",
    start: 139,
    end: 159,
    choiceId: "choice_4",
    choicePrompt: "CHOICE 4: THE DECISION",
    options: [
      {
        key: "A",
        text: "Believe Aflania and suspend Laqquo from his duties pending an investigation. Go to Ending A: The Truth Exposed.",
        targetScene: "ending_a",
        paranoiaDelta: -30,
        description: "Joan places his faith in Aflania, strips Laqquo of authority, and protects the marriage."
      },
      {
        key: "B",
        text: "Forgive Laqquo's suspicions but warn him never to repeat them without evidence. Go to Ending B: A Fragile Peace.",
        targetScene: "ending_b",
        paranoiaDelta: 10,
        description: "Joan chooses passive peace, leaving the venom intact."
      },
      {
        key: "C",
        text: "Remain uncertain and continue investigating privately. Go to Scene 4B.",
        targetScene: "scene_4b",
        paranoiaDelta: 15,
        description: "Joan remains torn, continuing to search while distancing himself from Aflania."
      },
      {
        key: "D",
        text: "Allow anger to overcome reason and accuse Aflania publicly. Go to Ending C: The Marriage Destroyed.",
        targetScene: "ending_c",
        paranoiaDelta: 50,
        isDestructive: true,
        description: "Paranoia consumes Joan. He lashes out with public accusations, shattering his marriage forever."
      }
    ]
  },
  {
    id: "scene_3b",
    title: "SCENE 3B: THE BROOCH RETURNED",
    background: "bedroom",
    start: 160,
    end: 165,
    isConditionalTransition: true,
    transitionPrompt: "Continue to Scene 3 or Scene 4A, depending on the investigation route.",
    conditionalTarget: {
      condition: "knowsEmiliaSecret",
      trueTarget: "scene_4a",
      falseTarget: "scene_3"
    }
  },
  {
    id: "scene_3c",
    title: "SCENE 3C: THE SERVANT'S ACCOUNT",
    background: "corridor",
    start: 166,
    end: 171,
    isConditionalTransition: true,
    transitionPrompt: "Continue to Scene 3 or Scene 4A.",
    conditionalTarget: {
      condition: "knowsEmiliaSecret",
      trueTarget: "scene_4a",
      falseTarget: "scene_3"
    }
  },
  {
    id: "scene_3d",
    title: "SCENE 3D: LAQQUO'S REACTION",
    background: "main_hall",
    start: 172,
    end: 179,
    choiceId: "choice_3d",
    choicePrompt: "Joan must decide whether to confront him or gather more testimony:",
    options: [
      {
        key: "A",
        text: "Confront Laqquo directly in the main hall. Go to Scene 3.",
        targetScene: "scene_3",
        paranoiaDelta: 5,
        description: "Joan summons Aflania, Cassian, and Laqquo for a collective reckoning."
      },
      {
        key: "B",
        text: "Seek testimony from Emilia regarding Laqquo's actions. Go to Scene 2B.",
        targetScene: "scene_2b",
        paranoiaDelta: -5,
        description: "Joan visits Emilia to uncover how Laqquo acquired the brooch."
      },
      {
        key: "C",
        text: "Question the servant further about who had access to the corridor. Go to Scene 3C.",
        targetScene: "scene_3c",
        paranoiaDelta: 0,
        description: "Joan interrogates the servant about corridor movements."
      }
    ]
  },
  {
    id: "scene_4a",
    title: "SCENE 4A: THE BUTTERFLY REVEALED",
    background: "main_hall",
    start: 180,
    end: 195,
    choiceId: "choice_5",
    choicePrompt: "CHOICE 5: WHAT DOES JOAN DO AFTER LAQQUO'S ARREST?",
    options: [
      {
        key: "A",
        text: "Apologize to Aflania and work to rebuild their marriage. Go to Ending A: The Truth Exposed.",
        targetScene: "ending_a",
        paranoiaDelta: -20,
        description: "Joan sincerely apologizes and dedicates himself to healing the trust."
      },
      {
        key: "B",
        text: "Offer Aflania the freedom to leave if she no longer feels safe. Go to Ending D: The Price of Forgiveness.",
        targetScene: "ending_d",
        paranoiaDelta: 5,
        description: "Joan respects her wounded boundaries, accepting separation with quiet sorrow."
      },
      {
        key: "C",
        text: "Focus on his duties and assume that the truth will repair everything. Go to Ending E: The Unfinished Apology.",
        targetScene: "ending_e",
        paranoiaDelta: 10,
        description: "Joan retreats into silence, mistakenly believing exoneration equals healing."
      }
    ]
  },
  {
    id: "scene_4b",
    title: "SCENE 4B: THE LAST TEST",
    background: "bedroom",
    start: 196,
    end: 209,
    choiceId: "choice_6",
    choicePrompt: "CHOICE 6: THE FINAL DECISION",
    options: [
      {
        key: "A",
        text: "Go to Aflania and acknowledge the harm his suspicion has caused. Go to Ending A: The Truth Exposed.",
        targetScene: "ending_a",
        paranoiaDelta: -25,
        description: "Joan catches Aflania before it is too late, taking full responsibility."
      },
      {
        key: "B",
        text: "Tell Aflania she must wait until he feels certain. Go to Ending D: The Price of Forgiveness.",
        targetScene: "ending_d",
        paranoiaDelta: 10,
        description: "Joan insists on stubborn certainty, driving Aflania to depart."
      },
      {
        key: "C",
        text: "Abandon the investigation and return to the marriage without discussing what happened. Go to Ending E: The Unfinished Apology.",
        targetScene: "ending_e",
        paranoiaDelta: 15,
        description: "Joan sweeps the suspicion under the rug, leading to the heartbreaking farewell letter."
      }
    ]
  },
  {
    id: "ending_a",
    title: "ENDING A: THE TRUTH EXPOSED",
    background: "garden_olive_tree",
    start: 210,
    end: 220,
    isEnding: true,
    endingTagline: "ENDING A: THE TRUTH EXPOSED — A CHANCE TO BEGIN AGAIN."
  },
  {
    id: "ending_b",
    title: "ENDING B: A FRAGILE PEACE",
    background: "bedroom",
    start: 221,
    end: 227,
    isEnding: true,
    endingTagline: "ENDING B: A FRAGILE PEACE — THE LIE SURVIVES IN SILENCE."
  },
  {
    id: "ending_c",
    title: "ENDING C: THE MARRIAGE DESTROYED",
    background: "bedroom",
    start: 228,
    end: 235,
    isEnding: true,
    endingTagline: "ENDING C: THE MARRIAGE DESTROYED — JEALOUSY WINS WITHOUT A SWORD."
  },
  {
    id: "ending_d",
    title: "ENDING D: THE PRICE OF FORGIVENESS",
    background: "bedroom",
    start: 236,
    end: 242,
    isEnding: true,
    endingTagline: "ENDING D: THE PRICE OF FORGIVENESS — LOVE DOES NOT GUARANTEE RECONCILIATION."
  },
  {
    id: "ending_e",
    title: "ENDING E: THE UNFINISHED APOLOGY",
    background: "office_desk",
    start: 243,
    end: 255,
    isEnding: true,
    endingTagline: "ENDING E: THE UNFINISHED APOLOGY — SILENCE IS NOT THE SAME AS HEALING."
  },
  {
    id: "epilogue",
    title: "EPILOGUE: WHAT THE TRAGEDY COULD HAVE TAUGHT HIM",
    background: "lecture_hall",
    start: 256,
    end: 270,
    isEpilogue: true
  }
];

// Helper to determine speaker and clean text
function parseDialogueLine(lineText) {
  const match = lineText.match(/^([A-Za-z\s]+):\s*[“"](.*)[”"]$/);
  if (match) {
    return {
      speaker: match[1].trim(),
      text: match[2].trim(),
      rawText: lineText,
      isDialogue: true
    };
  }
  return {
    speaker: "Narrator",
    text: lineText.trim(),
    rawText: lineText,
    isDialogue: false
  };
}

// Expression and glitch mapping rules
function enrichDialogue(sceneId, index, lineObj, def) {
  let expression = "neutral";
  let background = def.background;
  let paranoiaDelta = 0;
  let glitchEffect = false;
  let item = null;

  const sp = lineObj.speaker;
  const txt = lineObj.text;

  // Prologue
  if (sceneId === "prologue") {
    if (index >= 0 && index <= 4) {
      background = "rooftop_night";
      paranoiaDelta = 0;
    }
    if (sp === "Laqquo") {
      if (txt.includes("You seem troubled")) { expression = "calculating"; paranoiaDelta = 2; }
      else if (txt.includes("never place your love too deeply")) { expression = "insinuating"; glitchEffect = true; paranoiaDelta = 5; }
      else if (txt.includes("greater the betrayal")) { expression = "sharp"; glitchEffect = true; paranoiaDelta = 8; }
      else if (txt.includes("Merely possible")) { expression = "faint_smile"; glitchEffect = true; paranoiaDelta = 5; }
      else if (txt.includes("care for your happiness")) { expression = "concerned"; paranoiaDelta = 3; }
    } else if (sp === "Joan") {
      if (index < 12) { background = "rooftop_night"; }
      else { background = "bedroom"; }
    } else if (sp === "Aflania") {
      background = "bedroom";
      expression = "reading";
    }
    if (txt.includes("returned to his room")) {
      background = "bedroom";
    }
  }

  // Scene 1A
  if (sceneId === "scene_1a") {
    if (sp === "Aflania") {
      background = "bedroom";
      if (txt.includes("what do you believe")) expression = "thoughtful";
      else if (txt.includes("surrendering your judgment")) expression = "peaceful";
      else if (txt.includes("explain his concerns without asking you to condemn")) expression = "resolute";
      else expression = "peaceful";
      paranoiaDelta = -3;
    } else if (sp === "Joan") {
      if (index < 11) {
        background = "bedroom";
        paranoiaDelta = -2;
      } else {
        background = "courtyard_day";
      }
    } else if (sp === "Laqquo") {
      background = "courtyard_day";
      expression = "insinuating";
      glitchEffect = true;
      paranoiaDelta = 10;
    }
    if (txt.includes("The following morning, Laqquo approached")) {
      background = "courtyard_day";
      paranoiaDelta = 10;
    }
  }

  // Scene 1B
  if (sceneId === "scene_1b") {
    if (sp === "Aflania") {
      background = "bedroom";
      expression = "peaceful";
      paranoiaDelta = -3;
    } else if (sp === "Laqquo") {
      background = "courtyard_day";
      expression = "insinuating";
      glitchEffect = true;
      paranoiaDelta = 15;
    }
    if (txt.includes("The next morning, Laqquo approached")) {
      background = "courtyard_day";
      paranoiaDelta = 10;
    }
  }

  // Scene 1C
  if (sceneId === "scene_1c") {
    if (sp === "Aflania") {
      background = "bedroom";
      if (txt.includes("give him reason to distrust you")) expression = "wounded";
      else expression = "thoughtful";
      paranoiaDelta = 3;
    } else if (sp === "Emilia") {
      background = "corridor";
      expression = "hesitant";
      paranoiaDelta = -3;
    }
    if (txt.includes("The following day, Joan spoke with Emilia")) {
      background = "corridor";
    }
  }

  // Scene 2A
  if (sceneId === "scene_2a") {
    background = "courtyard_day";
    if (sp === "Cassian") {
      expression = "respectful";
      paranoiaDelta = -5;
    } else if (sp === "Servant") {
      expression = "neutral";
    }
    if (txt.includes("silver butterfly brooch") || txt.includes("Where did you find this")) {
      background = "corridor";
      item = "silver_butterfly_brooch";
      paranoiaDelta = 10;
    }
  }

  // Scene 2B
  if (sceneId === "scene_2b") {
    background = "corridor";
    if (sp === "Emilia") {
      if (txt.includes("butterfly brooch")) {
        expression = "guilty";
        item = "silver_butterfly_brooch";
      } else {
        expression = "hesitant";
      }
      paranoiaDelta = -10;
    }
  }

  // Scene 2C
  if (sceneId === "scene_2c") {
    background = "main_hall";
    if (sp === "Laqquo") {
      expression = "sharp";
      glitchEffect = true;
      paranoiaDelta = 10;
    }
  }

  // Scene 3
  if (sceneId === "scene_3") {
    background = "main_hall";
    if (sp === "Aflania") {
      if (txt.includes("You suspected me")) expression = "wounded";
      else expression = "firm";
      paranoiaDelta = -3;
    } else if (sp === "Cassian") {
      expression = "innocent_firm";
      paranoiaDelta = -2;
    } else if (sp === "Laqquo") {
      expression = "insinuating";
      glitchEffect = true;
      paranoiaDelta = 15;
    }
  }

  // Scene 3B
  if (sceneId === "scene_3b") {
    background = "bedroom";
    item = "silver_butterfly_brooch";
    if (sp === "Aflania") {
      expression = "thoughtful";
      paranoiaDelta = -10;
    }
  }

  // Scene 3C
  if (sceneId === "scene_3c") {
    background = "corridor";
    item = "silver_butterfly_brooch";
    if (sp === "Servant") {
      expression = "neutral";
    }
  }

  // Scene 3D
  if (sceneId === "scene_3d") {
    background = "main_hall";
    item = "silver_butterfly_brooch";
    if (sp === "Laqquo") {
      expression = "sharp";
      glitchEffect = true;
      paranoiaDelta = 15;
    }
  }

  // Scene 4A
  if (sceneId === "scene_4a") {
    background = "main_hall";
    item = "silver_butterfly_brooch";
    if (sp === "Emilia") {
      expression = "resolute";
      paranoiaDelta = -10;
    } else if (sp === "Laqquo") {
      expression = "glitch_extreme";
      glitchEffect = true;
      paranoiaDelta = 20;
    }
  }

  // Scene 4B
  if (sceneId === "scene_4b") {
    background = "bedroom";
    if (sp === "Aflania") {
      expression = "heartbroken";
      paranoiaDelta = 15;
    }
  }

  // Ending A
  if (sceneId === "ending_a") {
    background = "garden_olive_tree";
    item = "silver_butterfly_brooch";
    if (sp === "Aflania") {
      expression = "reconciled";
      paranoiaDelta = -20;
    }
  }

  // Ending B
  if (sceneId === "ending_b") {
    background = "bedroom";
    if (sp === "Aflania") {
      expression = "wounded";
      paranoiaDelta = 10;
    }
  }

  // Ending C
  if (sceneId === "ending_c") {
    background = "bedroom";
    if (sp === "Aflania") {
      expression = "heartbroken";
      paranoiaDelta = 30;
    }
  }

  // Ending D
  if (sceneId === "ending_d") {
    background = "bedroom";
    if (sp === "Aflania") {
      expression = "heartbroken";
      paranoiaDelta = 5;
    }
  }

  // Ending E
  if (sceneId === "ending_e") {
    background = "office_desk";
    if (txt.includes("Joan,") || txt.includes("I have waited for you") || txt.includes("Aflania.”")) {
      item = "aflania_letter";
      expression = "reading";
    }
  }

  // Epilogue
  if (sceneId === "epilogue") {
    background = "lecture_hall";
    if (sp === "Young Officer") {
      expression = "respectful";
    }
    if (txt.includes("finds an old letter from Aflania")) {
      item = "aflania_letter";
    }
  }

  return {
    ...lineObj,
    id: `${sceneId}_d${index}`,
    expression,
    background,
    paranoiaDelta,
    glitchEffect,
    item
  };
}

// Build the data structure
const storyData = {};

sceneDefs.forEach(def => {
  const sceneLines = allLines.slice(def.start - 1, def.end);
  const dialogues = [];

  let inChoice = false;
  let letterBuffer = [];

  for (let i = 0; i < sceneLines.length; i++) {
    const rawLine = sceneLines[i];
    const trimmed = rawLine.trim();
    if (!trimmed) continue;

    // Skip the scene header line itself
    if (trimmed === def.title) continue;

    // Detect choice section
    if (trimmed.startsWith("CHOICE ") || (def.id === "scene_3d" && trimmed.includes("Joan must decide whether to confront him"))) {
      inChoice = true;
      continue;
    }

    if (inChoice) {
      // Choice option lines are handled in def.options
      continue;
    }

    // Skip transition notes that are handled by logic
    if (trimmed.startsWith("Continue to Scene 3 or Scene 4A")) {
      continue;
    }

    // Special handling for letter in Ending E:
    // lines 245 to 253 are the letter
    if (def.id === "ending_e" && trimmed.startsWith("“Joan,")) {
      // Collect the entire letter
      let letterLines = [trimmed];
      let j = i + 1;
      while (j < sceneLines.length && !sceneLines[j].trim().endsWith("Aflania.”")) {
        if (sceneLines[j].trim()) letterLines.push(sceneLines[j].trim());
        j++;
      }
      if (j < sceneLines.length) {
        letterLines.push(sceneLines[j].trim());
      }
      i = j;

      const fullLetterText = letterLines.join("\n\n");
      dialogues.push(enrichDialogue(def.id, dialogues.length, {
        speaker: "Aflania",
        text: fullLetterText.replace(/^[“"']|[”"']$/g, '').trim(),
        rawText: fullLetterText,
        isDialogue: true,
        isLetter: true
      }, def));
      continue;
    }

    const parsed = parseDialogueLine(trimmed);
    dialogues.push(enrichDialogue(def.id, dialogues.length, parsed, def));
  }

  const sceneObj = {
    id: def.id,
    title: def.title,
    background: def.background,
    dialogues,
    isEnding: !!def.isEnding,
    isEpilogue: !!def.isEpilogue,
    endingTagline: def.endingTagline || null
  };

  if (def.choiceId) {
    sceneObj.choice = {
      id: def.choiceId,
      prompt: def.choicePrompt,
      options: def.options
    };
  }

  if (def.isConditionalTransition) {
    sceneObj.transition = {
      prompt: def.transitionPrompt,
      conditionalTarget: def.conditionalTarget
    };
  }

  storyData[def.id] = sceneObj;
});

console.log(`Story Data parsed successfully. Total scenes: ${Object.keys(storyData).length}`);

// Write JSON export
fs.writeFileSync('src/data/storyData.json', JSON.stringify(storyData, null, 2), 'utf8');

// Write JS export
const jsExport = `/**
 * STORY DATA OBJECT FOR "YET THE BUTTERFLIES FLUTTER AWAY"
 * 100% Verbatim from YET THE BUTTERFLIES FLUTTER AWAY.txt
 * Generated automatically with full type metadata, expression matching,
 * backgrounds, paranoia deltas, glitch triggers, and branching rules.
 */

export const storyData = ${JSON.stringify(storyData, null, 2)};
export default storyData;
`;
fs.writeFileSync('src/data/storyData.js', jsExport, 'utf8');

console.log('src/data/storyData.json and src/data/storyData.js written.');
