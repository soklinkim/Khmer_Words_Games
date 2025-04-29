import sqlite3

# Connect to your database (or create it)
conn = sqlite3.connect("game.db")
cursor = conn.cursor()

# Step 1: Create Words Table if it doesn't exist
cursor.execute('''
CREATE TABLE IF NOT EXISTS Words (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word TEXT,
    main_char TEXT,
    left_char TEXT,
    above TEXT,
    below TEXT,
    right TEXT,
    right_right TEXT,
    img_path TEXT,
    audio_path TEXT
)
''')

# Step 2: Insert sample data (edit/add your real words here)
words_to_insert = [
    ("ខ្លា", "ខ", None, None, "ល", "ា", None, "static/images/ខ្លា.jpg", "static/audio/ខ្លា.mp3"),
    ("គោ", "គ", "េ", None, None,"ា" , None, "static/images/គោ.jpg", "static/audio/គោ.mp3"),
    ("ឃ្លោក", "ឃ", "េ", None, "ល", "ា", "ក", "static/images/ឃ្លោក.jpg", "static/audio/ឃ្លោក.mp3"),
    ("ងាវ", "ង", None, None, None, "ា", "វ", "static/images/ងាវ.jpg", "static/audio/ងាវ.mp3"),
    ("ចាប", "ច", None, None, None, "ា", "ប", "static/images/ចាប.jpg", "static/audio/ចាប.mp3"),
    ("ឈឺ", "ឈ", None, 'ឺ', None, None, None, "static/images/ឈឺ.jpg", "static/audio/ឈឺ.mp3"),
    ("ញរ", "ញ", None, None, None, 'រ', None, "static/images/ញរ.jpg", "static/audio/ញរ.mp3"),
    ("ដី", "ដ", None, 'ី', None, None, None, "static/images/ដី.jpg", "static/audio/ដី.mp3"),
    ("ថូ", "ថ", None, None, 'ូ', None, None, "static/images/ថូ.jpg", "static/audio/ថូ.mp3"),
    ("ទា", "ទ", None, None, None, 'ា', None, "static/images/ទា.jpg", "static/audio/ទា.mp3"),
    ("នំ", "ន", None, 'ំ', None, None, None, "static/images/នំ.jpg", "static/audio/នំ.mp3"),
    ("ពោត", "ព", 'េ', None, None, 'ា', 'ត', "static/images/ពោត.jpg", "static/audio/ពោត.mp3"),
    ("ភេ", "ភ", 'េ', None, None, None, None, "static/images/ភេ.jpg", "static/audio/ភេ.mp3"),
    ("មេឃ", "ម", 'េ', None, None, 'ឃ', None, "static/images/មេឃ.jpg", "static/audio/មេឃ.mp3"),
    ("យំ", "យ", None, 'ំ', None, None, None, "static/images/យំ.webp", "static/audio/យំ.mp3"),
    ("រុយ", "រ", None, None, 'ុ', 'យ', None, "static/images/រុយ.jpg", "static/audio/រុយ.mp3"),
    ("វែក", "វ", 'ែ', None, None, 'ក', None, "static/images/វែក.jpg", "static/audio/វែក.mp3"),
    ("សេះ", "ស", 'េ', None, None, 'ះ', None, "static/images/សេះ.jpg", "static/audio/សេះ.mp3"),
    ("ហោះ", "ហ", 'េ', None, None, 'ា', 'ះ', "static/images/ហោះ.avif", "static/audio/ហោះ.mp3"),
    ("ឡាន", "ឡ", None, None, None,'ា' , 'ន', "static/images/ឡាន.avif", "static/audio/ឡាន.mp3"),
    ("អាន", "អ", None, None, None, 'ា', 'ន', "static/images/អាន.jpg", "static/audio/អាន.mp3"),

]

# Step 3: Insert data
for word in words_to_insert:
    cursor.execute('''
        INSERT INTO Words (
            word, main_char, left_char, above, below, right, right_right, img_path, audio_path
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', word)

# Commit and close
conn.commit()
conn.close()

print("✅ Words added to the database successfully!")
