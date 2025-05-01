1.	 Game Design Overview
        There are 2 game modes
        - Word Building: Drag and drop letters into boxes to build a word that matches a picture.
        - Word Learning: Drag the word to match with the picture.

2.	 Programing language

•	HTML & CSS: Game layout, styling, and structure
•	JavaScript (basic): Drag & drop functionality, audio clicks
•	Python: is the main programming language for this project. We use it for Game logic, routing, and communication
•	Flask is Python microframework used for building web application
•	SQLite is the Database for storing words, characters, pictures path, audio path,

3.	Data Structure
•	Words, Images, Audios: Stored in SQLite database with fields for ID, Khmer word, consonants/vowels, image filename, and pronunciation file.

4. download flask module to run the app.py

5. download Table Plus to view the database

6. There are some limitation in word building mode:

- we can only add word up to 6 characters. One is the main character/consonant, one must be the above vowel, one must be the below vowel or foot, one must be the right vowel
and the last one is for the sub consonant.

- We cannot add all the Khmer characters like vowels and character's foot into the database because it does not show dependently in HTML.
for example: "្ម"​ will show "្​ ម"​ in the HTML. we can use character's foot when the character and its foot look the same.

- If the word has a double characters like "កុក", we can only drop one inside the drop boxes. 

So, make sure to adviod adding new words with double letters and also word with complex foot.

7. Future Improvement:

- More interactive
- Add time tracker functionaily
- Move to application
- add more words

8. architecture

> Khmer_words_Games
        > static
            > Images
            > Audios
            > mode_1.js
            > mode_2.js
            > style1.CSS
            > styl2.CSS
        > template
           > building.HTML  (word building game)
           > learning.html
        > app.py
        > wordlist.py
> game.db 
> requirement
