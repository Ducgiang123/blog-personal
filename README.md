project to build a blogging website using NodeJS, Express, React and MongoDB

the project consists of two folders: backend and frontend
- backend: API management and specific business logic processing that provides API for managing users, posts and comments.
- frontend: User interface and interaction with specific backend that provides user interface to interact with backend functions, including login, post management, comments and statistics.

#instal for backend:
- create a ".env" file, here you will import variables such as MONGODB_URL (to connect to your MongoDB database), CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET. Or you can import into the following sample file to use:
<MONGODB_URL = 'mongodb+srv://buigiang1272003:TJEr6TEjvXwuhLbT@buigiang-blog.tfnwh.mongodb.net/?retryWrites=true&w=majority&appName=buigiang-blog'
# MONGODB_URL = 'mongodb+srv://accso1helloword:EXjJnBhOVbXuBkWk@blog.lddxg.mongodb.net/?retryWrites=true&w=majority&appName=Blog'
JWT_SECRET_KEY = "ca4a1d8b0422a5a9ff09d4aeb97e69c3d6e5b416f71d9ea41395cf469ed5f34a16381fdcb9709c86ad9101b30793d998b721136152a729de7acee2c85c612910"
CLOUDINARY_NAME = 'dm5dbghqn'
CLOUDINARY_API_KEY = '848879469411519'
CLOUDINARY_API_SECRET = 'q-Me9gx-CttWSQ9i2EoYixS6u0U'>
- run the command "npm i" to install the necessary libraries.
