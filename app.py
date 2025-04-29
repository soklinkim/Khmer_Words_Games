from flask import Flask, render_template, request, jsonify, session
import sqlite3
import random

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # for session tracking

DB_PATH = "game.db"

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

@app.route('/')
def index():
    word_data = get_random_word()
    session['correct_word'] = ''.join(word_data['components'])
    session['current_word_id'] = word_data['id']
    return render_template('index.html', word=word_data)

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