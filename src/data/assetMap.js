/**
 * ASSET MAP FOR "YET THE BUTTERFLIES FLUTTER AWAY"
 * Maps all visual backgrounds, character sprites, inventory items, GUI elements, and audio definitions.
 */

export const assetMap = {
  backgrounds: {
    // 3 Exclusive Game Backgrounds
    balcony: "Backgrounds/Balcony.jpg",
    field: "Backgrounds/Field.jpg",
    room: "Backgrounds/Room.jpg",

    // Scene mappings strictly using the 3 backgrounds:
    rooftop_night: "Backgrounds/Balcony.jpg",
    corridor: "Backgrounds/Balcony.jpg",

    courtyard_day: "Backgrounds/Field.jpg",
    courtyard_afternoon: "Backgrounds/Field.jpg",
    garden_olive_tree: "Backgrounds/Field.jpg",
    lecture_hall: "Backgrounds/Field.jpg",
    boardwalk: "Backgrounds/Field.jpg",
    plaza: "Backgrounds/Field.jpg",

    bedroom: "Backgrounds/Room.jpg",
    bedroom_sayori: "Backgrounds/Room.jpg",
    office_desk: "Backgrounds/Room.jpg",
    main_hall: "Backgrounds/Room.jpg"
  },
  items: {
    silver_butterfly_brooch: "asset/items/butterfly_brooch.png",
    aflania_letter: "asset/items/aflania_letter.png",
    notebook: "asset/background/bg/notebook.png",
    poem: "asset/background/bg/poem.jpg",
    poem_y1: "asset/background/bg/poem_y1.jpg",
    poem_y2: "asset/background/bg/poem_y2.jpg"
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
        thoughtful: "asset/GUI/menu_art_y.png",
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
      themeColor: "#34d399",
      expressions: {
        respectful: "asset/GUI/menu_art_n.png"
      }
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
    confirm_glitch: "asset/GUI/overlay/confirm_glitch.png",
    confirm_glitch2: "asset/GUI/overlay/confirm_glitch2.png",
    menu_bg: "asset/GUI/menu_bg.png"
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

export default assetMap;
