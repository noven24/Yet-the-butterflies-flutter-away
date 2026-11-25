const fs = require('fs');
const path = require('path');

const raw = fs.readFileSync('YET THE BUTTERFLIES FLUTTER AWAY.txt', 'utf8');

// Asset Mapping
const assetMap = {
  backgrounds: {
    rooftop_night: "asset/background/SIM/COURTYARD/loc_bg_sim_courtyard_3.png",
    bedroom: "asset/background/bg/bedroom.png",
    courtyard_day: "asset/background/SIM/COURTYARD/loc_bg_sim_courtyard_0.png",
    corridor: "asset/background/bg/corridor.png",
    main_hall: "asset/background/SIM/LOBBY/loc_bg_sim_lobby_1.png",
    garden_olive_tree: "asset/background/SIM/COURTYARD/loc_bg_sim_courtyard_1.png",
    office_desk: "asset/background/bg/class.png",
    lecture_hall: "asset/background/bg/class.png"
  },
  items: {
    silver_butterfly_brooch: "asset/items/butterfly_brooch.png",
    aflania_letter: "asset/items/aflania_letter.png",
    notebook: "asset/background/bg/notebook.png",
    poem: "asset/background/bg/poem.jpg"
  },
  characters: {
    Joan: {
      name: "Joan",
      title: "General Joan",
      role: "Protagonist / General of the Kingdom",
      avatar: "asset/content/Desktop UI/reflection.png",
      themeColor: "#60a5fa"
    },
    Aflania: {
      name: "Aflania",
      title: "Lady Aflania",
      role: "Joan's Wife / Noblewoman",
      spriteSheet: "asset/GUI/menu_art_y.png",
      themeColor: "#f472b6",
      expressions: {
        peaceful: "asset/GUI/menu_art_y.png",
        reading: "asset/GUI/menu_art_y.png",
        questioning: "asset/GUI/menu_art_y.png",
        wounded: "asset/GUI/menu_art_y_ghost.png",
        firm: "asset/GUI/menu_art_y.png",
        heartbroken: "asset/GUI/menu_art_y_ghost.png",
        reconciled: "asset/GUI/menu_art_y.png"
      }
    },
    Laqquo: {
      name: "Laqquo",
      title: "Lieutenant Laqquo",
      role: "Subordinate Lieutenant / Manipulator",
      spriteSheet: "asset/caracter monica/",
      themeColor: "#c084fc",
      poses: {
        idle: "asset/caracter monica/1l.png",
        pointing: "asset/caracter monica/2l.png",
        crossed: "asset/caracter monica/3a.png"
      },
      expressions: {
        faint_smile: "asset/caracter monica/b.png",
        calculating: "asset/caracter monica/a.png",
        concerned: "asset/caracter monica/e.png",
        insinuating: "asset/caracter monica/d.png",
        sharp: "asset/caracter monica/j.png",
        hostile: "asset/caracter monica/k.png",
        glitch_level1: "asset/caracter monica/g1.png",
        glitch_level2: "asset/caracter monica/g2.png",
        glitch_level3: "asset/caracter monica/g3.png",
        glitch_extreme: "asset/caracter monica/g4.png"
      }
    },
    Cassian: {
      name: "Cassian",
      title: "Officer Cassian",
      role: "Young Officer",
      spriteSheet: "asset/GUI/menu_art_n.png",
      themeColor: "#38bdf8",
      expressions: {
        respectful: "asset/GUI/menu_art_n.png",
        innocent_firm: "asset/GUI/menu_art_n.png"
      }
    },
    Emilia: {
      name: "Emilia",
      title: "Emilia",
      role: "Laqquo's Wife",
      spriteSheet: "asset/GUI/menu_art_s.png",
      themeColor: "#fb923c",
      expressions: {
        hesitant: "asset/GUI/menu_art_s.png",
        guilty: "asset/GUI/menu_art_s.png",
        resolute: "asset/GUI/menu_art_s.png"
      }
    },
    Servant: {
      name: "Servant",
      title: "Castle Servant",
      role: "Attendant",
      themeColor: "#9ca3af"
    },
    "Young Officer": {
      name: "Young Officer",
      title: "Young Officer",
      role: "Academy Cadet",
      themeColor: "#34d399"
    },
    Narrator: {
      name: "Narrator",
      title: "",
      role: "Narrator",
      themeColor: "#cbd5e1"
    }
  },
  gui: {
    textbox: "asset/GUI/textbox.png",
    textbox_glitch: "asset/GUI/textbox_monika.png",
    namebox: "asset/GUI/namebox.png",
    ctc: "asset/GUI/ctc.png",
    choice_idle: "asset/GUI/button/choice_idle_background.png",
    choice_hover: "asset/GUI/button/choice_hover_background.png",
    blood_drop: "asset/GUI/blood_drop.png",
    confirm_glitch: "asset/GUI/overlay/confirm_glitch.png"
  },
  audio: {
    bgm: {
      abyss_whispers: { name: "Abyss Whispers", type: "synth_drone", baseFreq: 55, mood: "dark_suspense" },
      peaceful_hearth: { name: "Peaceful Hearth", type: "synth_arpeggio", baseFreq: 220, mood: "gentle_calm" },
      rising_paranoia: { name: "Rising Paranoia", type: "synth_pulse", baseFreq: 110, mood: "psychological_horror" },
      truth_and_tears: { name: "Truth and Tears", type: "synth_chords", baseFreq: 164.81, mood: "melancholic_revelation" }
    },
    sfx: {
      glitch_static: { name: "Glitch Static", type: "noise_burst", duration: 0.15 },
      heartbeat: { name: "Heartbeat", type: "sub_thump", duration: 0.3 },
      page_flip: { name: "Page Flip", type: "paper_rustle", duration: 0.2 },
      brooch_chime: { name: "Silver Chime", type: "metallic_sparkle", duration: 0.5 }
    }
  }
};

// Write assetMap.js
fs.writeFileSync('src/data/assetMap.js', `// Asset Map for "Yet the Butterflies Flutter Away"
export const assetMap = ${JSON.stringify(assetMap, null, 2)};
export default assetMap;
`, 'utf8');

console.log('assetMap.js created.');
