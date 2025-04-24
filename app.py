# from flask import Flask
# from flask_sqlalchemy import SQLAlchemy

# app = Flask(__name__)
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///khmer_game.db'
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# db = SQLAlchemy(app)

# class User(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     username = db.Column(db.String(100), nullable=False)
#     highest_score = db.Column(db.Integer, default=0)
#     last_saved = db.Column(db.JSON, nullable=True)

# class Progress(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     username = db.Column(db.String(100), db.ForeignKey('user.username'))
#     current_word_index = db.Column(db.Integer, default=0)
#     game_mode = db.Column(db.String(50))
#     timer = db.Column(db.Integer, nullable=True)

# class Word(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     word = db.Column(db.String(100), nullable=False)
#     main_char = db.Column(db.String(10))
#     left = db.Column(db.String(10))
#     above = db.Column(db.String(10))
#     below = db.Column(db.String(10))
#     right = db.Column(db.String(10))
#     right_right = db.Column(db.String(10))
#     img_path = db.Column(db.String(100))
#     audio_path = db.Column(db.String(100))
    
    


# if __name__ == '__main__':
#     with app.app_context():
#         db.create_all()
#     app.run(debug=True)

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

        return word_data
    return None

def get_distractors():
    khmer_letters = ['ក', 'ខ', 'គ', 'ឃ', 'ង', 'ច', 'ឆ', 'ជ', 'ឈ', 'ញ',
                     'ដ', 'ឋ', 'ឌ', 'ឍ', 'ណ', 'ត', 'ថ', 'ទ', 'ធ', 'ន',
                     'ប', 'ផ', 'ព', 'ភ', 'ម', 'យ', 'រ', 'ល', 'វ', 'ស',
                     'ហ', 'ឡ', 'អ', 'ា', 'ិ', 'ី', 'ឹ', 'ឺ', 'ុ', 'ូ', 'ួ', 'ំ', 'ះ' , 'េ', 'ែ', 'ៃ', 'ោ', 'ៅ',]
    return random.sample(khmer_letters, 2)

@app.route('/')
def index():
    word_data = get_random_word()
    session['correct_word'] = ''.join(word_data['components'])
    session['current_word_id'] = word_data['id']
    return render_template('index.html', word=word_data)

@app.route('/check', methods=['POST'])
def check_word():
    user_word = request.json.get('user_word')
    correct_word = session.get('correct_word')

    is_correct = user_word == correct_word
    return jsonify({'correct': is_correct, 'correct_word': correct_word})

if __name__ == '__main__':
    app.run(debug=True)
