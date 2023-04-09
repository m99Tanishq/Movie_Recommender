from flask import Flask , jsonify , request
import pickle
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)

with open('movies_dict.pkl', 'rb') as f:
        movies = pickle.load(f)

similarity = pickle.load(open('similarity.pkl', 'rb'))


@app.route('/movies')
def get_movies():
    return jsonify(movies)


@app.route('/recommend', methods=['POST'])
def recommend():
    movie = request.get_json()['movie']
    distances = similarity[int(movie)]
    movies_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[1:6]

    recommended_movies = []

    for i in movies_list:
        recommended_movies.append(movies['title'][i[0]])
    return jsonify(recommended_movies)

    

if __name__ == '__main__':
    app.run(debug=True)




