from flask import Flask, render_template, request, jsonify, session
import sqlite3
import random

app = Flask(__name__)
app.secret_key = 'secret_key_86'  # for session tracking

DB_PATH = "game.db"

# connect with the start page
@app.route('/')
def home():
    return render_template('start.html')

# Add routes for each game mode
@app.route('/word-building')
def word_building():
    word_data = get_random_word()
    session['correct_word'] = ''.join(word_data['components'])
    session['current_word_id'] = word_data['id']
    return render_template('building.html', word=word_data)

@app.route('/word-learning')
def word_learning():
    return render_template('learning.html')


# Add a new route to serve the learning mode data
@app.route('/learning-mode')
def learning_mode():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Only select words that have valid image/audio
    cursor.execute("SELECT * FROM Words WHERE img_path IS NOT NULL AND audio_path IS NOT NULL")
    rows = cursor.fetchall()
    conn.close()

    if len(rows) < 2:
        return jsonify({'error': 'Not enough valid words'}), 400

    # Randomly pick 2 words
    selected = random.sample(rows, 2)
    words = []
    correct_words = []

    for row in selected:
        word_text = row[1]
        words.append({
            'id': row[0],
            'img_path': row[8],
            'audio_path': row[9],
            'word': word_text
        })
        correct_words.append(word_text)

    # Add 2 distractors that are NOT in selected
    distractor = get_distractors_2(correct_words)
    all_words = correct_words + distractor
    random.shuffle(all_words)

    session['learning_correct'] = correct_words

    return jsonify({'words': words, 'choices': all_words})

def get_distractors_2(exclude_words=[]):
    distractor_words = [
        'កុក', 'ខ្លា', 'គោ', 'ឃ្លោក', 'ងាវ', 'ចាប', 'ឆ្មា', 'ជ្រូក', 'ឈឺ', 'ញរ',
        'ដី', 'ឌុប', 'ណែម', 'ត្រី', 'ថូ', 'ទា', 'ធ្មេញ', 'នំ', 'បង្គង', 'ផ្កា',
        'ពោត', 'ភេ', 'មេឃ', 'យំ', 'រុយ', 'លលក', 'វែក', 'សេះ', 'ហោះ', 'ឡាន', 'អាន'
    ]
    filtered = [w for w in distractor_words if w not in exclude_words]
    return random.sample(filtered, 2)

def get_random_word():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Words ORDER BY RANDOM() LIMIT 1")
    row = cursor.fetchone()
    conn.close()

    if row:
        word_data = {
            'id': row[0],
            'word': row[1],
            'main_char': row[2],
            'left_char': row[3],
            'above': row[4],
            'below': row[5],
            'right': row[6],
            'right_right': row[7],
            'img_path': row[8],
            'audio_path': row[9]
        }

        # Build correct word
        components = [row[3], row[4], row[2], row[5], row[6], row[7]]
        correct_components = [c for c in components if c is not None]
        word_data['components'] = correct_components
        word_data['shuffled'] = random.sample(correct_components + get_distractors(), len(correct_components) + 2)
        
        # Save expected parts in the session
        expected_parts = {
            'top': row[4],
            'left': row[3],
            'main': row[2],
            'bottom': row[5],
            'right': row[6],
            'right_right': row[7],
        }
        session['expected_parts'] = expected_parts  # Save the correct positions
        return word_data
    return None

def get_distractors():
    khmer_letters = ['ក', 'ខ', 'គ', 'ឃ', 'ង', 'ច', 'ឆ', 'ជ', 'ឈ', 'ញ',
                     'ដ', 'ឋ', 'ឌ', 'ឍ', 'ណ', 'ត', 'ថ', 'ទ', 'ធ', 'ន',
                     'ប', 'ផ', 'ព', 'ភ', 'ម', 'យ', 'រ', 'ល', 'វ', 'ស',
                     'ហ', 'ឡ', 'អ', 'ា', 'ិ', 'ី', 'ឹ', 'ឺ', 'ុ', 'ូ', 'ួ', 'ំ', 'ះ' , 'េ', 'ែ', 'ៃ',]
    return random.sample(khmer_letters, 2)


@app.route('/check', methods=['POST'])
def check_word():
    user_components = request.json.get('components')
    correct_word = session.get('correct_word')
    expected_parts = session.get('expected_parts')  # e.g., {'top': 'េ', 'main': 'ក', ...}

    if not user_components or not expected_parts:
        return jsonify({'correct': False, 'error': 'Missing data'})

    # Build the user word using correct order
    positions = ['left', 'top', 'main', 'bottom', 'right', 'right_right']
    user_word = ''.join([user_components.get(p, '') for p in positions])
    correct_word = ''.join([expected_parts.get(p) or '' for p in positions])

    is_correct = user_word == correct_word
    return jsonify({'correct': is_correct, 'correct_word': correct_word})

@app.route('/get-word')
def get_word():
    word_data = get_random_word()
    if word_data:
        session['correct_word'] = ''.join(word_data['components'])
        session['current_word_id'] = word_data['id']
        return jsonify(word_data)
    else:
        return jsonify({'error': 'No word found'}), 404


if __name__ == '__main__':
    app.run(debug=True)