import random, base64
from tabulate import tabulate
from sys import argv

def create_connections(file : str):
    with open(file, "rb") as encoded_file:
        encoded_data = encoded_file.read()
    decoded_data = base64.b64decode(encoded_data).decode("utf-8")
    lines = decoded_data.splitlines()
    d = dict()
    words = []
    first_group = lines[0].strip().split(',')
    for i in first_group:
       d[i] = 1
       words.append(i)
    second_group = lines[1].strip().split(',')
    for i in second_group:
       d[i] = 2
       words.append(i)
    third_group = lines[2].strip().split(',')
    for i in third_group:
       d[i] = 3
       words.append(i)
    fourth_group = lines[3].strip().split(',')
    for i in fourth_group:
       d[i] = 4
       words.append(i)
    meaning_group = lines[4].strip().split(',')
    return d, words, meaning_group

def print_table(words):
    table = [words[i:i+4] for i in range(0, len(words), 4)]
    print(tabulate(table, tablefmt="grid"))
def clear_terminal():
    print("\033[H\033[J", end="")
def words_to_meanings(words, m):
    print(f'Meaning: \033[31m{m[0]}\033[0m Words: {words[0:4]}')
    print(f'Meaning: \033[31m{m[1]}\033[0m Words: {words[4:8]}')
    print(f'Meaning: \033[31m{m[2]}\033[0m Words: {words[8:12]}')
    print(f'Meaning: \033[31m{m[3]}\033[0m Words: {words[12:16]}')


if __name__ == "__main__":
    if len(argv) != 2:
        print(f"Usage: python3 {argv[0]} <file>")
        exit(1)
    file = argv[1]
    d, words, m = create_connections(file)
    words_original = words.copy()
    random.shuffle(words)
    lives = 4 ; guess_count = 0
    clear_terminal()
    while(True):
        print_table(words)
        print(f"Lives: {'\033[31m<3\033[0m '*lives}")
        guess = input("Guess the words (comma separated) or Press Enter to shuffle: ")
        if not guess:
            clear_terminal()
            random.shuffle(words)
        else:
            guesses = guess.strip().split(',')
            if len(guesses) != 4:
                clear_terminal()
                print("Please enter exactly 4 words.")
                continue
            if any(i not in words for i in guesses):
                clear_terminal()
                print("Please enter valid words.")
                continue
            if len(set(guesses)) != 4:
                clear_terminal()
                print("Please enter unique words.")
                continue
            groups  = [d[i] for i in guesses]
            if len(set(groups)) == 1:
                clear_terminal()
                print(f"Correct!")
                print("Meaning: ", m[groups[0]-1])
                for i in range(len(words)):
                    if words[i] in guesses:
                        words[i] = '\033[31m' + m[groups[0]-1] + '\033[0m'
                guess_count += 1
                if guess_count == 4:
                    clear_terminal()
                    print("Congratulations! You have guessed all the words.")
                    print_table(words)
                    break
  
            elif len(set(groups)) == 2:
                clear_terminal()
                print("One away!")
                lives -= 1
                if lives == 0:
                    print("Game Over! You have no lives left.")
                    words_to_meanings(words_original, m)
                    break
            else:
                clear_terminal()
                print("Incorrect! ")
                lives -= 1
                if lives == 0:
                    print("Game Over! You have no lives left.")
                    words_to_meanings(words_original, m)
                    break