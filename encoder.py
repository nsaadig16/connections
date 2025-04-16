import base64
from sys import argv

# Read the original file
with open(argv[1], "rb") as file:
    file_data = file.read()

# Encode the content
encoded_data = base64.b64encode(file_data)

# Save the encoded content to a new file
with open('out.txt' if len(argv) < 3 else argv[2], "wb") as encoded_file:
    encoded_file.write(encoded_data)