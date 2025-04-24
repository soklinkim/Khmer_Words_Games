from app import db, Word

word1 = Word(
    word='កុក', main_char='ក', left=None, above=None, below='ុ', right='ក', right_right=None,
    img_path='images/bird.png', audio_path='audio/bird.mp3'
)
word2 = Word(
    word='ខ្លា', main_char='ខ', left=None, above=None, below='ល', right='ា', right_right=None,
    img_path='images/tiger.png', audio_path='audio/tiger.mp3'
)

db.session.add(word1)
db.session.add(word2)
db.session.commit()
